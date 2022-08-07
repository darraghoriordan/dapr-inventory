import {
    AttributeValue,
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
            TableName: "products",
            Item: {
                key: {S: `products-api||${model.key}`}, // use dapr name spacing
                value: {
                    S: JSON.stringify({
                        title: model.title,
                        description: model.description,
                        availableStock: model.availableStock,
                    }),
                },
            },
        });
        const result = await this.client.send(putItemCommand);

        this.logger.log("product save response", result);

        return model;
    }

    async updateStock(id: string, availableStock: number): Promise<void> {
        const result = await this.getOneProduct(id);

        result.availableStock = availableStock;
        this.logger.log("updating stock", result);

        const saveResult = await this.addProduct(result);

        this.logger.log("saved with updated stock", {saveResult});
    }

    async getOneProduct(id: string): Promise<ProductDto> {
        const getItemResult = await this.client.send(
            new GetItemCommand({
                TableName: "products",
                Key: {key: {S: `products-api||${id}`}},
            })
        );

        this.logger.log("AWSSdk: getOneProduct Get", {getItemResult});

        return this.mapOne(getItemResult.Item || {});
    }

    async getAllProductsScan(): Promise<ProductDto[]> {
        // get a trace context
        const tracer = opentelemetry.trace.getTracer("basic");

        // create a span
        const span = tracer.startSpan("getAllProductsScan");

        // do some work
        const products = await this.client.send(
            new ScanCommand({TableName: "products"})
        );

        // add some meta data to the span
        span.setAttribute("thisAttribute", "this is a value set manually");
        span.addEvent("got the data from store", {
            ["manualEventAttribute"]: "this is a value",
        });
        const mappedProducts = (products.Items || []).map((i) => {
            return this.mapOne(i);
        });

        // finalise the span
        span.end();
        return mappedProducts;
    }

    private mapOne(i: Record<string, AttributeValue>) {
        const modelProps = JSON.parse(i.value.S || "{}");
        return {
            key: i.key.S,
            description: modelProps.description,
            title: modelProps.title,
            availableStock: modelProps.availableStock || 0,
        } as ProductDto;
    }
}
