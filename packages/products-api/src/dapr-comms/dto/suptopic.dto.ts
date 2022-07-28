import {ApiProperty} from "@nestjs/swagger";
import {Allow} from "class-validator";
import RoutesDto from "./routes.dto";

class SubTopicDto {
    @Allow()
    @ApiProperty()
    topic!: string;

    @Allow()
    @ApiProperty()
    pubsubname!: string;

    @Allow()
    @ApiProperty()
    routes!: RoutesDto;
}

export default SubTopicDto;
