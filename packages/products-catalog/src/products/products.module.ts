import {Module} from "@nestjs/common";
import {DaprCommsModule} from "../dapr-comms/dapr-comms.module";
import {DynamoClientModule} from "../dynamo-client/dynamo-client.module";
import {ProductsController} from "./products.controller";
import {ProductsService} from "./products.service";

@Module({
    imports: [DaprCommsModule, DynamoClientModule],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
