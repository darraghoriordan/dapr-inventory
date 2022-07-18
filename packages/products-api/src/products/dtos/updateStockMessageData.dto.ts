import {ApiProperty} from "@nestjs/swagger";
import {IsInt, MinLength} from "class-validator";

class UpdateStockMessageDataDto {
    @ApiProperty()
    @MinLength(1)
    productId!: string;

    @ApiProperty()
    @IsInt()
    availableStock!: number;
}

export default UpdateStockMessageDataDto;
