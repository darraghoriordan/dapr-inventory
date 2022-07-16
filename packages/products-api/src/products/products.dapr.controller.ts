import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import ProductDto from "./dtos/product.dto";
import {ProductsDaprService} from "./products.service.dapr";

@ApiTags("Products")
@Controller("products/dapr")
export class ProductsDaprController {
    constructor(private readonly productService: ProductsDaprService) {}

    @ApiOkResponse({isArray: true, type: ProductDto})
    @Get()
    getAll(): Promise<ProductDto[]> {
        return this.productService.getAllProducts();
    }
    @ApiOkResponse({type: ProductDto})
    @Get(":id")
    getOne(@Param("id") id: string): Promise<ProductDto> {
        return this.productService.getOneProduct(id);
    }

    @ApiOkResponse({type: ProductDto})
    @Post()
    add(@Body() model: ProductDto): Promise<ProductDto> {
        return this.productService.addProduct(model);
    }
}
