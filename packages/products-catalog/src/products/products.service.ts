import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";
import {Inject, Injectable} from "@nestjs/common";
import ProductDto from "./dtos/product.dto";

@Injectable()
export class ProductsService {
    constructor(
        @Inject("DynamoClient")
        private client: DynamoDBClient
    ) {}
    async getAllProducts(): Promise<ProductDto[]> {
        const products = await this.client.send(
            new ScanCommand({TableName: "products"})
        );

        const mappedProducts = (products.Items || []).map((i) => {
            return {
                id: i.id.S,
                description: i.description.S,
                title: i.title.S,
            } as ProductDto;
        });
        return mappedProducts;
        // return [
        //     {
        //         id: "product1",
        //         description: "this is a product1",
        //         title: "This is a title1",
        //     },
        //     {
        //         id: "product2",
        //         description: "this is a product2",
        //         title: "This is a title2",
        //     },
        //     {
        //         id: "product3",
        //         description: "this is a product3",
        //         title: "This is a title3",
        //     },
        // ];
    }
}
