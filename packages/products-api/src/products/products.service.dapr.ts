import {Inject, Injectable} from "@nestjs/common";
import ProductDto from "./dtos/product.dto";
import {DaprClient} from "@dapr/dapr";
import CoreLoggerService from "../core-logger/CoreLoggerService";
import {KeyValueType} from "@dapr/dapr/types/KeyValue.type";

@Injectable()
export class ProductsDaprService {
    constructor(
        @Inject("DynamoClient")
        private daprClient: DaprClient,
        private logger: CoreLoggerService
    ) {}

    async addProduct(model: ProductDto): Promise<ProductDto> {
        const result = await this.daprClient.state.save(
            "products-api-datastore",
            [
                {
                    key: model.key,
                    value: {
                        title: model.title,
                        description: model.description,
                    },
                },
            ]
        );

        this.logger.log("product save response dapr", result);

        return model;
    }

    async getOneProduct(id: string): Promise<ProductDto> {
        const result = (await this.daprClient.state.get(
            "products-api-datastore",
            id
        )) as KeyValueType;

        this.logger.log("getOneProductGet", {result});

        return {
            key: id,
            description: result.description,
            title: result.title,
        } as ProductDto;
    }
    async getAllProducts(): Promise<ProductDto[]> {
        try {
            const result = await this.daprClient.state.getBulk(
                "products-api-datastore",
                ["product1", "product2", "product3"]
            );

            this.logger.log("product all response with dapr", result);

            const mapped = result.map((kv) => {
                return {
                    key: kv.key,
                    description: kv.description,
                    title: kv.title,
                } as ProductDto;
            });

            return mapped as any as ProductDto[];
        } catch (error) {
            this.logger.error("failed to get bulk from state provider", error);
        }

        return [];
    }
}
