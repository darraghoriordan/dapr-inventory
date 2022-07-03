import {Global, Module} from "@nestjs/common";
import {DaprCommsModule} from "../dapr-comms/dapr-comms.module";
import CoreLoggerService from "./CoreLoggerService";
import {LoggingInterceptor} from "./LoggingInterceptor";

@Global()
@Module({
    imports: [DaprCommsModule],
    providers: [
        //LoggingConfigurationService,
        CoreLoggerService,
        LoggingInterceptor,
    ],
    exports: [CoreLoggerService, LoggingInterceptor],
})
export class LoggerModule {}
