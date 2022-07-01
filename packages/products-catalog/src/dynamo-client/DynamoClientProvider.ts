import {DynamoClientConfigurationService} from "./DynamoClientConfigurationService";
import {
    CreateTableCommand,
    DynamoDBClient,
    DynamoDBClientConfig,
    ListTablesCommand,
    PutItemCommand,
} from "@aws-sdk/client-dynamodb";

const createTables = async (client: DynamoDBClient) => {
    // init our table if it doesn't exist
    const tables = await client.send(new ListTablesCommand({}));

    const filteredTables = tables.TableNames?.filter(
        (tname) => tname === "products"
    );
    const exists = filteredTables && filteredTables.length > 0;

    if (!exists) {
        await client.send(
            new CreateTableCommand({
                TableName: "products",
                KeySchema: [{AttributeName: "id", KeyType: "HASH"}],
                AttributeDefinitions: [
                    {AttributeName: "id", AttributeType: "S"},
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1,
                },
            })
        );

        const p1Promise = client.send(
            new PutItemCommand({
                TableName: "products",
                Item: {
                    id: {S: "product1"},
                    description: {S: "this is a product1"},
                    title: {S: "This is a title1"},
                },
            })
        );
        const p2Promise = client.send(
            new PutItemCommand({
                TableName: "products",
                Item: {
                    id: {S: "product2"},
                    description: {S: "this is a product2"},
                    title: {S: "This is a title2"},
                },
            })
        );
        const p3Promise = client.send(
            new PutItemCommand({
                TableName: "products",
                Item: {
                    id: {S: "product3"},
                    description: {S: "this is a product3"},
                    title: {S: "This is a title3"},
                },
            })
        );

        await Promise.allSettled([p1Promise, p2Promise, p3Promise]);
    }
};

export const DynamoClientProvider = {
    provide: "DynamoClient",
    useFactory: async (config: DynamoClientConfigurationService) => {
        const options: DynamoDBClientConfig = {
            region: config.dynamoRegion,
            endpoint: config.dynamoUrl,
            tls: false,
        };
        const client = new DynamoDBClient(options);

        if (config.shouldCreateTables) {
            createTables(client);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
        return client;
    },
    inject: [DynamoClientConfigurationService],
};
