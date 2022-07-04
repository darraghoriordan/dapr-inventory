import {Controller, Get} from "@nestjs/common";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";

@ApiTags("health")
@Controller()
export class HealthController {
    constructor() {}

    @ApiOkResponse()
    @Get()
    getHello(): string {
        return "hello";
    }
}
