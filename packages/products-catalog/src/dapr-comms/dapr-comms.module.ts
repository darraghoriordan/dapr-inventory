import {DaprClient, DaprServer} from "@dapr/dapr";
import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import DaprAppConfig from "./DaprAppConfig";
import {DaprAppConfigProvider} from "./DaprAppConfigProvider";
import {DaprClientProvider} from "./DaprClientProvider";
import {DaprCommsConfigurationService} from "./DaprCommsConfigurationService";

import configVariables from "./DaprCommsConfigurationVariables";
import {DaprServerProvider} from "./DaprServerProvider";

// This cannot be dependent on anything other than some config env vars because
// it's used to retrieve the config vars for everything
// else!!
// Don't try use the core logger in here :)
@Module({
    imports: [ConfigModule.forFeature(configVariables)],
    providers: [
        DaprCommsConfigurationService,
        DaprClientProvider,
        DaprServerProvider,
        DaprAppConfigProvider,
    ],
    exports: [DaprClient, DaprServer, DaprAppConfig],
})
export class DaprCommsModule {
    constructor() {
        console.log("initialising dapr comms module");
    }
}
