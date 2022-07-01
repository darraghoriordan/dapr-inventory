import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {DynamoClientConfigurationService} from "./DynamoClientConfigurationService";
import configVariables from "./DynamoClientConfigurationVariables";
import {DynamoClientProvider} from "./DynamoClientProvider";

@Module({
    imports: [ConfigModule.forFeature(configVariables)],
    providers: [DynamoClientProvider, DynamoClientConfigurationService],
    exports: [DynamoClientProvider],
})
export class DynamoClientModule {}
