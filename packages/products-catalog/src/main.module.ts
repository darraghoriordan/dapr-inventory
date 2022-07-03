import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import "reflect-metadata";
import {LoggerModule} from "./core-logger/logger.module";
// import {DaprCommsModule} from "./dapr-comms/dapr-comms.module";
// import {ProductsModule} from "./products/products.module";

@Module({
    imports: [
        // loads .env file on local into process
        ConfigModule.forRoot({
            cache: true,
        }),
        // DaprCommsModule,
        LoggerModule,
        // ProductsModule,
    ],
    controllers: [],
    providers: [],
})
export class MainModule {}
