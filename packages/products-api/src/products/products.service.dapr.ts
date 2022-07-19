import {Injectable} from "@nestjs/common";
import ProductDto from "./dtos/product.dto";
import {DaprClient} from "@dapr/dapr";
import CoreLoggerService from "../core-logger/CoreLoggerService";
import {KeyValueType} from "@dapr/dapr/types/KeyValue.type";

@Injectable()
export class ProductsDaprService {
    constructor(
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
                        availableStock: model.availableStock,
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
        )) as ProductDto;

        result.key = id;

        this.logger.log("getOneProductGet", {result});

        return result as ProductDto;
    }

    async updateStock(id: string, availableStock: number): Promise<void> {
        const result = await this.getOneProduct(id);

        result.availableStock = availableStock;
        this.logger.log("updating stock", result);

        const saveResult = await this.addProduct(result);

        this.logger.log("saved with updated stock", {saveResult});
    }

    async getAllProducts(): Promise<ProductDto[]> {
        try {
            const result = await this.daprClient.state.getBulk(
                "products-api-datastore",
                ["product1", "product2", "product3"]
            );

            this.logger.log("product all response with dapr", result);

            const mapped = result.map((kv) => {
                return this.mapOne(kv);
            });

            return mapped;
        } catch (error) {
            this.logger.error("failed to get bulk from state provider", error);
        }

        return [];
    }

    private mapOne(kv: KeyValueType): ProductDto {
        return {
            key: kv.key,
            description: kv.data.description,
            title: kv.data.title,
            availableStock: kv.data.availableStock || 0,
        } as ProductDto;
    }
}
