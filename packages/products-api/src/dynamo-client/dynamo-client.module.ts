import {Module} from "@nestjs/common";
import {LoggerModule} from "../core-logger/logger.module";
import {DaprCommsModule} from "../dapr-comms/dapr-comms.module";
//import {DynamoClientConfigurationService} from "./DynamoClientConfigurationService";
import {DynamoClientProvider} from "./DynamoClientProvider";

@Module({
    imports: [DaprCommsModule, LoggerModule],
    providers: [
        DynamoClientProvider, // DynamoClientConfigurationService
    ],
    exports: [DynamoClientProvider],
})
export class DynamoClientModule {}
