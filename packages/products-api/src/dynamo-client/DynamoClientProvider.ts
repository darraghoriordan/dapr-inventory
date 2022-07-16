//import {DynamoClientConfigurationService} from "./DynamoClientConfigurationService";
import {
    CreateTableCommand,
    DynamoDBClient,
    DynamoDBClientConfig,
    ListTablesCommand,
    PutItemCommand,
} from "@aws-sdk/client-dynamodb";

import CoreLoggerService from "../core-logger/CoreLoggerService";
import DaprAppConfig from "../dapr-comms/DaprAppConfig";

const createTables = async (
    client: DynamoDBClient,
    logger: CoreLoggerService
) => {
    try {
        // init our table if it doesn't exist
        const tables = await client.send(new ListTablesCommand({}));

        const filteredTables = tables.TableNames?.filter(
            (tname) => tname === "products"
        );
        const exists = filteredTables && filteredTables.length > 0;

        if (!exists) {
            logger.debug("table not found, creating");
            await client.send(
                new CreateTableCommand({
                    TableName: "products",
                    KeySchema: [{AttributeName: "key", KeyType: "HASH"}],
                    AttributeDefinitions: [
                        {AttributeName: "key", AttributeType: "S"},
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                })
            );
            logger.debug("inserting seed data");
            const p1Promise = client.send(
                new PutItemCommand({
                    TableName: "products",
                    Item: {
                        key: {S: "products-api||product1"},
                        value: {
                            S: JSON.stringify({
                                description: "this is a product1",
                                title: "this is a title1",
                            }),
                        },
                    },
                })
            );
            const p2Promise = client.send(
                new PutItemCommand({
                    TableName: "products",
                    Item: {
                        key: {S: "products-api||product2"},
                        value: {
                            S: JSON.stringify({
                                description: "this is a product2",
                                title: "this is a title2",
                            }),
                        },
                    },
                })
            );
            const p3Promise = client.send(
                new PutItemCommand({
                    TableName: "products",
                    Item: {
                        key: {S: "products-api||product3"},
                        value: {
                            S: JSON.stringify({
                                description: "this is a product3",
                                title: "this is a title3",
                            }),
                        },
                    },
                })
            );

            await Promise.allSettled([p1Promise, p2Promise, p3Promise]);
        } else {
            logger.log("dynamo tables already exist, skipping.");
        }
    } catch (error) {
        logger.error("Failed to create dynamo tables", error);
    }
};

export const DynamoClientProvider = {
    provide: "DynamoClient",
    useFactory: async (config: DaprAppConfig, logger: CoreLoggerService) => {
        const options: DynamoDBClientConfig = {
            region: config.dynamoRegion,
            endpoint: config.dynamoUrl,
            credentials: {
                accessKeyId: config.awsAccessKeyId!,
                secretAccessKey: config.awsSecretAccessKey!,
            },
        };
        const client = new DynamoDBClient(options);

        if (config.dynamoCreateTables) {
            logger.debug("Running create dynamo tables");
            createTables(client, logger);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
        return client;
    },
    inject: [DaprAppConfig, CoreLoggerService],
};
