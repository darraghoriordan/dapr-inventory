# What is this?

A learning tool and demo for building microservies with good dev experience.

There's apps in .net, react and nodejs. There's instances of prometheus, envoy, grafana, dapr, seq, zipkin, alertmanager.

It's all local in docker compose which is nice for dev experience imho.

There's localstack, local dynamo and a bunch of other service communication and pubsub services for dependencies.

# Building

rename dapr-secrets-local.json.template to dapr-secrets-local.json - if you have any issues with aws you might need a real aws secret key

rename any .env.example to .env

```bash
docker compose build
docker compose up
```

# starting

note that on FIRST (only first) init the database takes a while to init so wait a minute or two then `docker compose down` and `docker compose up` again

occasionaly the products-api gets into trouble in the same way - just down a `down` and `up` an it should be ok.

There are many services that expose many ports to the host for debugging, these may cause conflicts with other running apps or containers

# Grafana

needs to be told where to find prometheus

new datasource > prometheus > source = http://prometheus:9090 , name = Dapr, default = True
then add the dashboards from /grafana-meta/dapr
