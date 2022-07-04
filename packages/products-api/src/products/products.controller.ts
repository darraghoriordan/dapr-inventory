import {Controller, Get} from "@nestjs/common";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import ProductDto from "./dtos/product.dto";
import {ProductsService} from "./products.service";

@ApiTags("Products")
@Controller()
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

    @ApiOkResponse({isArray: true, type: ProductDto})
    @Get()
    getAllProducts(): Promise<ProductDto[]> {
        return this.productService.getAllProducts();
    }
}
