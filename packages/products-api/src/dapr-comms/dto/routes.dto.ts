import {ApiProperty} from "@nestjs/swagger";
import {Allow} from "class-validator";
import RoutingRuleDto from "./routing-rule.dto";

class RoutesDto {
    @Allow()
    @ApiProperty({isArray: true, type: RoutingRuleDto, required: false})
    rules?: RoutingRuleDto[];

    @Allow()
    @ApiProperty()
    default!: string;
}

export default RoutesDto;
