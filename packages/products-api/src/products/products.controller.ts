import {Controller, Get, Post} from "@nestjs/common";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import ProductDto from "./dtos/product.dto";
import {ProductsService} from "./products.service";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

    @ApiOkResponse({isArray: true, type: ProductDto})
    @Get()
    getAllProducts(): Promise<ProductDto[]> {
        return this.productService.getAllProductsGet();
    }

    @ApiOkResponse({isArray: true, type: ProductDto})
    @Get("awsScan")
    getAllProductsScan(): Promise<ProductDto[]> {
        return this.productService.getAllProductsScan();
    }

    @ApiOkResponse({isArray: true, type: ProductDto})
    @Get("withDapr")
    getAllProductsDapr(): Promise<ProductDto[]> {
        return this.productService.getAllProductsViaDapr();
    }

    @ApiOkResponse({isArray: true, type: ProductDto})
    @Post("withDapr")
    addProductsDapr(): Promise<ProductDto[]> {
        return this.productService.getAllProductsViaDapr();
    }
}
