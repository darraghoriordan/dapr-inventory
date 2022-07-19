import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import CoreLoggerService from "../core-logger/CoreLoggerService";
import ProductDto from "./dtos/product.dto";
import UpdateStockMessageDto from "./dtos/updateStockMessage.dto";
import {ProductsAwsSdkService} from "./products.service.awssdk";

@ApiTags("Products")
@Controller("products/awssdk")
export class ProductsAwsSdkController {
    constructor(
        private readonly productService: ProductsAwsSdkService,
        private readonly logger: CoreLoggerService
    ) {}

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

    @ApiOkResponse()
    @Post("updatestock")
    updateStock(@Body() model: UpdateStockMessageDto): Promise<void> {
        this.logger.log("updating stock controller message received (aws)", {
            model,
        });

        return this.productService.updateStock(
            model.data.productId,
            model.data.availableStock
        );
    }
}
