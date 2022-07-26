#!/bin/sh
set -e

echo "Generating envoy.yaml config file..."
cat /tmpl/envoy.yaml.tmpl | envsubst \$ENVOY_INVENTORY_API_ADDRESS,\$ENVOY_PRODUCTS_API_ADDRESS,\$ENVOY_DAPR_API_ADDRESS,\$ENVOY_PORT > /etc/envoy.yaml

echo "Starting Envoy..."
/usr/local/bin/envoy -c /etc/envoy.yaml