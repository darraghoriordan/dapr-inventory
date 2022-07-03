import {Module} from "@nestjs/common";
import {DaprCommsModule} from "../dapr-comms/dapr-comms.module";
import CoreLoggerService from "./CoreLoggerService";
import {LoggingInterceptor} from "./LoggingInterceptor";

@Module({
    imports: [DaprCommsModule],
    providers: [CoreLoggerService, LoggingInterceptor],
    exports: [CoreLoggerService, LoggingInterceptor],
})
export class LoggerModule {}
