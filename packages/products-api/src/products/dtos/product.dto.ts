import {ApiProperty} from "@nestjs/swagger";
import {IsInt, MinLength} from "class-validator";

class ProductDto {
    @MinLength(1)
    @ApiProperty()
    key!: string;

    @MinLength(1)
    @ApiProperty()
    description!: string;

    @ApiProperty()
    @MinLength(1)
    title!: string;

    @ApiProperty()
    @IsInt()
    availableStock!: number;
}

export default ProductDto;
