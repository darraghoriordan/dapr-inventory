import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";
import {Inject, Injectable} from "@nestjs/common";
import ProductDto from "./dtos/product.dto";
import opentelemetry from "@opentelemetry/api";

@Injectable()
export class ProductsService {
    constructor(
        @Inject("DynamoClient")
        private client: DynamoDBClient
    ) {}

    async getAllProducts(): Promise<ProductDto[]> {
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
                id: i.id.S,
                description: i.description.S,
                title: i.title.S,
            } as ProductDto;
        });
        span.end();
        return mappedProducts;
    }
}
