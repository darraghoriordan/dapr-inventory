import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import CoreLoggerService from "../core-logger/CoreLoggerService";
import ProductDto from "./dtos/product.dto";
import UpdateStockMessageDto from "./dtos/updateStockMessage.dto";
import {ProductsDaprService} from "./products.service.dapr";

@ApiTags("Products")
@Controller("products/dapr")
export class ProductsDaprController {
    constructor(
        private readonly productService: ProductsDaprService,
        private readonly logger: CoreLoggerService
    ) {}

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

    @ApiOkResponse()
    @Post("updatestock")
    updateStock(@Body() model: UpdateStockMessageDto): Promise<void> {
        this.logger.log("updating stock controller message received", {model});

        return this.productService.updateStock(
            model.data.productId,
            model.data.availableStock
        );
    }
}
