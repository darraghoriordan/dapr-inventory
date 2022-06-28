import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import "reflect-metadata";
import {CoreConfigModule} from "./core-config/CoreConfig.module";
import {LoggerModule} from "./core-logger/logger.module";
import {ProductsModule} from "./products/products.module";

@Module({
    imports: [
        ConfigModule.forRoot({cache: true}),
        LoggerModule,
        CoreConfigModule,
        ProductsModule,
    ],
    controllers: [],
    providers: [],
})
export class MainModule {}
