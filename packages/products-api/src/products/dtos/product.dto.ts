import {ApiProperty} from "@nestjs/swagger";
import {MinLength} from "class-validator";

class ProductDto {
    @MinLength(1)
    @ApiProperty()
    id!: string;

    @MinLength(1)
    @ApiProperty()
    description!: string;

    @ApiProperty()
    @MinLength(1)
    title!: string;
}

export default ProductDto;
