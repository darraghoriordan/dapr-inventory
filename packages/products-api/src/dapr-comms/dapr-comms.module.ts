import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {DaprAppConfigProvider} from "./DaprAppConfigProvider";
import {DaprClientProvider} from "./DaprClientProvider";
import {DaprCommsConfigurationService} from "./DaprCommsConfigurationService";
import configVariables from "./DaprCommsConfigurationVariables";

// This cannot be dependent on anything other than some config env vars because
// we use dapr to retrieve the config vars for everything else!!
// ==================
// 👆 DON'T try use the core logger anywhere in this module :) 👆
// =================
@Module({
    imports: [ConfigModule.forFeature(configVariables)],
    providers: [
        DaprCommsConfigurationService,
        DaprClientProvider,
        DaprAppConfigProvider,
    ],
    exports: [DaprClientProvider, DaprAppConfigProvider],
})
export class DaprCommsModule {
    constructor() {
        console.log("initialising dapr comms module");
    }
}
