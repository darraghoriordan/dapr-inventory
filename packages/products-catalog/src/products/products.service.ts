import {Injectable} from "@nestjs/common";
import ProductDto from "./dtos/product.dto";

@Injectable()
export class ProductsService {
    getAllProducts(): ProductDto[] {
        return [
            {
                id: "product1",
                description: "this is a product1",
                title: "This is a title1",
            },
            {
                id: "product2",
                description: "this is a product2",
                title: "This is a title2",
            },
            {
                id: "product3",
                description: "this is a product3",
                title: "This is a title3",
            },
        ];
    }
}
