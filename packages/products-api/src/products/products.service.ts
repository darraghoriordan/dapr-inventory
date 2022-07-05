import {
    DynamoDBClient,
    GetItemCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";
import {Inject, Injectable} from "@nestjs/common";
import ProductDto from "./dtos/product.dto";
import opentelemetry from "@opentelemetry/api";
import {DaprClient} from "@dapr/dapr";
import CoreLoggerService from "../core-logger/CoreLoggerService";

@Injectable()
export class ProductsService {
    constructor(
        @Inject("DynamoClient")
        private client: DynamoDBClient,
        private daprClient: DaprClient,
        private logger: CoreLoggerService
    ) {}

    async addProductViaDapr(model: ProductDto): Promise<ProductDto> {
        const result = await this.daprClient.state.save("products-api-dynamo", [
            {
                key: model.key,
                value: {title: model.title, description: model.description},
            },
        ]);

        this.logger.log("product save response", result);

        return model;
    }

    async getAllProductsViaDapr(): Promise<ProductDto[]> {
        const result = await this.daprClient.state.getBulk(
            "products-api-dynamo",
            ["product1", "product2", "product3"]
        );

        this.logger.log("product response with dapr", result);

        return result.map((kv) => {
            return kv.value;
        }) as any as ProductDto[];
    }

    async getAllProductsGet(): Promise<ProductDto[]> {
        const product1 = await this.client.send(
            new GetItemCommand({
                TableName: "products",
                Key: {key: {S: "product1"}},
            })
        );
        const product2 = await this.client.send(
            new GetItemCommand({
                TableName: "products",
                Key: {key: {S: "product2"}},
            })
        );
        const product3 = await this.client.send(
            new GetItemCommand({
                TableName: "products",
                Key: {key: {S: "product3"}},
            })
        );

        const mappedProducts = [product1, product2, product3].map((i) => {
            return {
                key: i.Item?.key.S,
                description: i.Item?.description.S,
                title: i.Item?.title.S,
            } as ProductDto;
        });
        this.logger.log("getAllProductsGet", {product1, product2, product3});
        return mappedProducts;
    }
    async getAllProductsScan(): Promise<ProductDto[]> {
        const tracer = opentelemetry.trace.getTracer("basic");
        const span = tracer.startSpan("getAllProductsManual");
        const products = await this.client.send(
            new ScanCommand({TableName: "products"})
        );
        span.setAttribute("thisAttribute", "this is a value set manually");
        span.addEvent("got the data from store", {
            ["manualEventAttribute"]: "this is a value",
        });
        const mappedProducts = (products.Items || []).map((i) => {
            return {
                key: i.key.S,
                description: i.description.S,
                title: i.title.S,
            } as ProductDto;
        });
        span.end();
        return mappedProducts;
    }
}
