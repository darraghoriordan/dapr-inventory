import {DaprClient} from "@dapr/dapr";
import DaprAppConfig from "./DaprAppConfig";

export const DaprAppConfigProvider = {
    provide: DaprAppConfig,
    useFactory: async (daprClient: DaprClient): Promise<DaprAppConfig> => {
        try {
            console.log("dapr app config client factory method");
            const appConfig = new DaprAppConfig(daprClient);
            await appConfig.init();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
            return appConfig;
        } catch (error) {
            console.error("Couldn't init dapr config", error);
            // maybe even process exit here. we need to tell the container to restart
            process.exit(1);
        }
    },
    inject: [DaprClient],
};
