import {Controller, Get} from "@nestjs/common";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {ProductsService} from "./products.service";

@ApiTags("Products")
@Controller()
export class ProductsController {
    constructor(private readonly appService: ProductsService) {}

    @ApiOkResponse()
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
