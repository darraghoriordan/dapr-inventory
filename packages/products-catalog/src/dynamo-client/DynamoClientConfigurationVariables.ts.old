import {registerAs} from "@nestjs/config";

export default registerAs("dynamoclient", () => ({
    dynamoUrl: process.env.DYNAMO_URL,
    dynamoRegion: process.env.DYNAMO_REGION,
    shouldCreateTables: process.env.DYNAMO_CREATE_TABLES,
}));
