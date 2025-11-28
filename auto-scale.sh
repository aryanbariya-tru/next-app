#!/bin/sh

CPU_PERCENTAGE_UPPER_LIMIT=10
CPU_PERCENTAGE_LOWER_LIMIT=5
PROMETHEUS_URL=${PROMETHEUS_URL:-"http://prometheus:9090"}
SLEEP_INTERVAL=5

PROMETHEUS_QUERY="sum(rate(container_cpu_usage_seconds_total{container_label_com_docker_swarm_service_name!=\"\"}[1m])) by (container_label_com_docker_swarm_service_name)"

while true; do
  results=$(curl -s "${PROMETHEUS_URL}/api/v1/query?query=${PROMETHEUS_QUERY}" | jq -r '.data.result[] | "\(.metric.container_label_com_docker_swarm_service_name) \(.value[1])"')

  for line in $results; do
    service=$(echo $line | awk '{print $1}')
    cpu=$(echo $line | awk '{print $2}')

    [ -z "$service" ] && continue
    [ -z "$cpu" ] && continue

    current_replicas=$(docker service inspect $service | jq '.[].Spec.Mode.Replicated.Replicas')
    replica_max=$(docker service inspect $service | jq -r '.[].Spec.Labels["swarm.autoscaler.maximum"]')
    replica_min=$(docker service inspect $service | jq -r '.[].Spec.Labels["swarm.autoscaler.minimum"]')

    # SCALE UP
    if [ "$(echo "$cpu > $CPU_PERCENTAGE_UPPER_LIMIT" | bc)" -eq 1 ] && [ "$current_replicas" -lt "$replica_max" ]; then
      new_replicas=$((current_replicas+1))
      echo "Scaling UP $service → $new_replicas"
      docker service scale $service=$new_replicas
    fi

    # SCALE DOWN
    if [ "$(echo "$cpu < $CPU_PERCENTAGE_LOWER_LIMIT" | bc)" -eq 1 ] && [ "$current_replicas" -gt "$replica_min" ]; then
      new_replicas=$((current_replicas-1))
      echo "Scaling DOWN $service → $new_replicas"
      docker service scale $service=$new_replicas
    fi

  done

  sleep $SLEEP_INTERVAL
done
