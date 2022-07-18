import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {IsString, ValidateNested} from "class-validator";
import UpdateStockMessageDataDto from "./updateStockMessageData.dto";

class UpdateStockMessageDto {
    @ApiProperty()
    @Type(() => UpdateStockMessageDataDto)
    @ValidateNested()
    data!: UpdateStockMessageDataDto;

    @ApiProperty()
    @IsString()
    datacontenttype!: string;

    @ApiProperty()
    @IsString()
    id!: string;

    @ApiProperty()
    @IsString()
    pubsubname!: string;

    @ApiProperty()
    @IsString()
    source!: string;

    @ApiProperty()
    @IsString()
    specversion!: string;

    @ApiProperty()
    @IsString()
    topic!: string;

    @ApiProperty()
    @IsString()
    traceid!: string;

    @ApiProperty()
    @IsString()
    traceparent!: string;

    @ApiProperty()
    @IsString()
    tracestate!: string;

    @ApiProperty()
    @IsString()
    type!: string;
}

export default UpdateStockMessageDto;
