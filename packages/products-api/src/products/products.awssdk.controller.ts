import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import ProductDto from "./dtos/product.dto";
import {ProductsAwsSdkService} from "./products.service.awssdk";

@ApiTags("Products")
@Controller("products/awssdk")
export class ProductsAwsSdkController {
    constructor(private readonly productService: ProductsAwsSdkService) {}

    @ApiOkResponse({type: ProductDto})
    @Get(":id")
    getOne(@Param("id") id: string): Promise<ProductDto> {
        return this.productService.getOneProduct(id);
    }

    @ApiOkResponse({isArray: true, type: ProductDto})
    @Get()
    getAll(): Promise<ProductDto[]> {
        return this.productService.getAllProductsScan();
    }

    @ApiOkResponse({type: ProductDto})
    @Post()
    add(@Body() model: ProductDto): Promise<ProductDto> {
        return this.productService.addProduct(model);
    }
}
