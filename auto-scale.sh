#!/bin/sh

CPU_PERCENTAGE_UPPER_LIMIT=10
CPU_PERCENTAGE_LOWER_LIMIT=5
PROMETHEUS_URL=${PROMETHEUS_URL:-"http://prometheus:9090"}
SLEEP_INTERVAL=5

# Helper: get service name from container ID
get_service_name() {
  container_id=$1
  docker ps --format '{{.ID}} {{.Names}}' | grep "^$container_id " | awk '{print $2}' | cut -d'_' -f1
}

while true; do
  # Query CPU usage from Prometheus
  results=$(curl -s "${PROMETHEUS_URL}/api/v1/query?query=sum(rate(container_cpu_usage_seconds_total[1m])) by (id)" | jq -r '.data.result[] | "\(.metric.id) \(.value[1])"')

  for line in $results; do
    container_id=$(echo $line | awk '{print $1}' | sed 's|/docker/||')
    cpu=$(echo $line | awk '{print $2}')
    service=$(get_service_name $container_id)

    if [ -z "$service" ]; then
      continue
    fi

    current_replicas=$(docker service inspect $service | jq '.[].Spec.Mode.Replicated.Replicas')
    replica_max=$(docker service inspect $service | jq -r '.[].Spec.Labels["swarm.autoscaler.maximum"]')
    replica_min=$(docker service inspect $service | jq -r '.[].Spec.Labels["swarm.autoscaler.minimum"]')

    # SCALE UP
    if [ "$(echo "$cpu > $CPU_PERCENTAGE_UPPER_LIMIT" | bc)" -eq 1 ] && [ "$current_replicas" -lt "$replica_max" ]; then
      new_replicas=$((current_replicas+1))
      echo "Scaling UP $service to $new_replicas"
      docker service scale $service=$new_replicas
    fi

    # SCALE DOWN
    if [ "$(echo "$cpu < $CPU_PERCENTAGE_LOWER_LIMIT" | bc)" -eq 1 ] && [ "$current_replicas" -gt "$replica_min" ]; then
      new_replicas=$((current_replicas-1))
      echo "Scaling DOWN $service to $new_replicas"
      docker service scale $service=$new_replicas
    fi

  done

  sleep $SLEEP_INTERVAL
done
