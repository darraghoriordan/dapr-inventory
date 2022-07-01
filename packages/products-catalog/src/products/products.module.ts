import {Module} from "@nestjs/common";
import {DynamoClientModule} from "../dynamo-client/dynamo-client.module";
import {ProductsController} from "./products.controller";
import {ProductsService} from "./products.service";

@Module({
    imports: [DynamoClientModule],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
