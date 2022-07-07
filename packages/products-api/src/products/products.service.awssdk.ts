import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";
import {Inject, Injectable} from "@nestjs/common";
import ProductDto from "./dtos/product.dto";
import opentelemetry from "@opentelemetry/api";
import CoreLoggerService from "../core-logger/CoreLoggerService";

@Injectable()
export class ProductsAwsSdkService {
    constructor(
        @Inject("DynamoClient")
        private client: DynamoDBClient,
        private logger: CoreLoggerService
    ) {}

    async addProduct(model: ProductDto): Promise<ProductDto> {
        const putItemCommand = new PutItemCommand({
            TableName: "products-api-datastore",
            Item: {
                key: {S: model.key},
                value: {
                    S: JSON.stringify({
                        title: model.title,
                        description: model.description,
                    }),
                },
            },
        });
        const result = await this.client.send(putItemCommand);

        this.logger.log("product save response", result);

        return model;
    }

    async getOneProduct(id: string): Promise<ProductDto> {
        const product1 = await this.client.send(
            new GetItemCommand({
                TableName: "products",
                Key: {key: {S: id}},
            })
        );

        this.logger.log("getOneProductGet", {product1});

        return {
            key: product1.Item?.key.S,
            description: product1.Item?.description.S,
            title: product1.Item?.title.S,
        } as ProductDto;
    }

    async getAllProductsScan(): Promise<ProductDto[]> {
        const tracer = opentelemetry.trace.getTracer("basic");
        const span = tracer.startSpan("getAllProductsScan");
        const products = await this.client.send(
            new ScanCommand({TableName: "products"})
        );
        span.setAttribute("thisAttribute", "this is a value set manually");
        span.addEvent("got the data from store", {
            ["manualEventAttribute"]: "this is a value",
        });
        const mappedProducts = (products.Items || []).map((i) => {
            const modelProps = JSON.parse(i.value.S || "{}");
            return {
                key: i.key.S,
                description: modelProps.description,
                title: modelProps.title,
            } as ProductDto;
        });
        span.end();
        return mappedProducts;
    }
}
