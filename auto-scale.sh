#!/bin/bash

# ===========================
# Configurable environment variables
# ===========================
LOOP=${LOOP:-"yes"}
PROMETHEUS_URL=${PROMETHEUS_URL:-"http://monitoring_prometheus:9090"}
CPU_PERCENTAGE_UPPER_LIMIT=${CPU_PERCENTAGE_UPPER_LIMIT:-10}
CPU_PERCENTAGE_LOWER_LIMIT=${CPU_PERCENTAGE_LOWER_LIMIT:-5}
SLEEP_INTERVAL=${SLEEP_INTERVAL:-60}  # seconds

PROMETHEUS_API="api/v1/query?query="
PROMETHEUS_QUERY="sum(rate(container_cpu_usage_seconds_total%7Bcontainer_label_com_docker_swarm_task_name%3D~%27.%2B%27%7D%5B5m%5D))BY(container_label_com_docker_swarm_service_name%2Cinstance)*100"

# ===========================
# Helper functions
# ===========================

# Scale service up by 1
scale_up() {
    local service=$1
    local current=$2
    local max=$3

    if (( current < max )); then
        local new_replicas=$((current + 1))
        echo "$(date) Scaling UP $service: $current -> $new_replicas"
        docker service scale "$service=$new_replicas"
    else
        echo "$(date) $service already at max replicas ($max)"
    fi
}

# Scale service down by 1
scale_down() {
    local service=$1
    local current=$2
    local min=$3

    if (( current > min )); then
        local new_replicas=$((current - 1))
        echo "$(date) Scaling DOWN $service: $current -> $new_replicas"
        docker service scale "$service=$new_replicas"
    else
        echo "$(date) $service already at min replicas ($min)"
    fi
}

# ===========================
# Main loop
# ===========================

while [[ "$LOOP" == "yes" ]]; do
    echo "$(date) Querying Prometheus for CPU metrics..."

    prometheus_results=$(curl -s "${PROMETHEUS_URL}/${PROMETHEUS_API}${PROMETHEUS_QUERY}" | jq . 2>/dev/null)

    if [[ -z "$prometheus_results" || "$prometheus_results" == "null" ]]; then
        echo "$(date) Prometheus query failed or returned null. Retrying in $SLEEP_INTERVAL seconds..."
        sleep "$SLEEP_INTERVAL"
        continue
    fi

    # Get unique services from Prometheus results
    services=$(echo "$prometheus_results" | jq -r '.data.result[].metric.container_label_com_docker_swarm_service_name' | sort -u)

    for service in $services; do
        # Skip if no service
        if [[ -z "$service" ]]; then
            continue
        fi

        # Fetch current replicas and min/max from labels
        current_replicas=$(docker service inspect "$service" | jq '.[0].Spec.Mode.Replicated.Replicas' 2>/dev/null)
        replica_min=$(docker service inspect "$service" | jq -r '.[0].Spec.Labels["swarm.autoscaler.minimum"]' 2>/dev/null)
        replica_max=$(docker service inspect "$service" | jq -r '.[0].Spec.Labels["swarm.autoscaler.maximum"]' 2>/dev/null)
        autoscale_enabled=$(docker service inspect "$service" | jq -r '.[0].Spec.Labels["swarm.autoscaler"]' 2>/dev/null)

        # Default safe values
        current_replicas=${current_replicas:-0}
        replica_min=${replica_min:-0}
        replica_max=${replica_max:-999}

        if [[ "$autoscale_enabled" != "true" ]]; then
            echo "$(date) $service does not have autoscaling enabled. Skipping..."
            continue
        fi

        # Get average CPU for this service across containers
        avg_cpu=$(echo "$prometheus_results" | jq "[.data.result[] | select(.metric.container_label_com_docker_swarm_service_name==\"$service\") | .value[1] | tonumber] | add / length" 2>/dev/null)
        avg_cpu=${avg_cpu:-0}

        echo "$(date) Service=$service CPU=$avg_cpu Current=$current_replicas Min=$replica_min Max=$replica_max"

        # Decide scaling
        if (( $(echo "$avg_cpu > $CPU_PERCENTAGE_UPPER_LIMIT" | bc -l) )); then
            scale_up "$service" "$current_replicas" "$replica_max"
        elif (( $(echo "$avg_cpu < $CPU_PERCENTAGE_LOWER_LIMIT" | bc -l) )); then
            scale_down "$service" "$current_replicas" "$replica_min"
        else
            echo "$(date) $service CPU within limits. No scaling."
        fi
    done

    echo "$(date) Sleeping for $SLEEP_INTERVAL seconds..."
    sleep "$SLEEP_INTERVAL"
done
