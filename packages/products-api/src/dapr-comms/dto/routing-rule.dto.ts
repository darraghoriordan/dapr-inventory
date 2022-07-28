import {ApiProperty} from "@nestjs/swagger";
import {Allow} from "class-validator";

class RoutingRuleDto {
    @Allow()
    @ApiProperty()
    match!: string;

    @Allow()
    @ApiProperty()
    path!: string;
}

export default RoutingRuleDto;
