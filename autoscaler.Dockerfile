FROM alpine:latest

RUN apk add --no-cache bash curl jq docker-cli

WORKDIR /app
COPY auto-scale.sh ./auto-scale.sh
RUN chmod +x auto-scale.sh



CMD ["bash", "/app/auto-scale.sh"]
