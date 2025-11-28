#!/bin/sh

CPU_PERCENTAGE_UPPER_LIMIT=10
CPU_PERCENTAGE_LOWER_LIMIT=5
PROMETHEUS_API="api/v1/query?query="
PROMETHEUS_QUERY="sum(rate(container_cpu_usage_seconds_total%7Bcontainer_label_com_docker_swarm_task_name%3D~%27.%2B%27%7D%5B1m%5D))BY(container_label_com_docker_swarm_service_name%2Cinstance)*100"

while true; do

  # SCALE UP
  for service in $(curl -s "${PROMETHEUS_URL}/${PROMETHEUS_API}${PROMETHEUS_QUERY}" \
      | jq -r ".data.result[] | select(.value[1] | tonumber > ${CPU_PERCENTAGE_UPPER_LIMIT}) | .metric.container_label_com_docker_swarm_service_name"); do
    current_replicas=$(docker service inspect $service | jq ".[].Spec.Mode.Replicated.Replicas")
    replica_max=$(docker service inspect $service | jq -r ".[].Spec.Labels[\"swarm.autoscaler.maximum\"]")
    if [ "$current_replicas" -lt "$replica_max" ]; then
      new_replicas=$((current_replicas+1))
      echo "Scaling UP $service to $new_replicas"
      docker service scale $service=$new_replicas
    fi
  done

  # SCALE DOWN
  for service in $(curl -s "${PROMETHEUS_URL}/${PROMETHEUS_API}${PROMETHEUS_QUERY}" \
      | jq -r ".data.result[] | select(.value[1] | tonumber < ${CPU_PERCENTAGE_LOWER_LIMIT}) | .metric.container_label_com_docker_swarm_service_name"); do
    current_replicas=$(docker service inspect $service | jq ".[].Spec.Mode.Replicated.Replicas")
    replica_min=$(docker service inspect $service | jq -r ".[].Spec.Labels[\"swarm.autoscaler.minimum\"]")
    if [ "$current_replicas" -gt "$replica_min" ]; then
      new_replicas=$((current_replicas-1))
      echo "Scaling DOWN $service to $new_replicas"
      docker service scale $service=$new_replicas
    fi
  done

  sleep 5
done
