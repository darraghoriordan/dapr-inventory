import {Module} from "@nestjs/common";
import {LoggerModule} from "../core-logger/logger.module";
import {DaprCommsModule} from "../dapr-comms/dapr-comms.module";
import {DynamoClientModule} from "../dynamo-client/dynamo-client.module";
import {HealthController} from "./health.controller";
import {ProductsAwsSdkController} from "./products.awssdk.controller";
import {ProductsDaprController} from "./products.dapr.controller";
import {ProductsAwsSdkService} from "./products.service.awssdk";
import {ProductsDaprService} from "./products.service.dapr";

@Module({
    imports: [DaprCommsModule, DynamoClientModule, LoggerModule],
    controllers: [
        ProductsAwsSdkController,
        ProductsDaprController,
        HealthController,
    ],
    providers: [ProductsDaprService, ProductsAwsSdkService],
})
export class ProductsModule {}
