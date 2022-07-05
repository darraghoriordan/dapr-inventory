aws dynamo query --table-name "products" --endpoint-url http://host.docker.internal:5412

aws dynamodb get-item --table-name "products" --key '{"key": {"S": "product1"}}' --endpoint-url http://host.docker.internal:5412 --region us-west-2
aws dynamodb list-tables --endpoint-url http://localhost:5412
