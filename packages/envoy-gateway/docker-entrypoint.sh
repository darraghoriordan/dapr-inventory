#!/bin/sh
set -e

echo "Generating envoy.yaml config file..."
cat /tmpl/envoy.yaml.tmpl | envsubst \$ENVOY_INVENTORY_API_ADDRESS,\$ENVOY_PRODUCTS_API_ADDRESS,\$ENVOY_DAPR_API_ADDRESS,\$ENVOY_PORT,\$ENVOY_TRACING_API_ADDRESS > /etc/envoy.yaml

echo "Starting Envoy..."
/usr/local/bin/envoy --component-log-level upstream:debug,http:debug,router:debug,config:debug -c /etc/envoy.yaml