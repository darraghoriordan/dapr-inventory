import {DaprCommsConfigurationService} from "./DaprCommsConfigurationService";
import {DaprClient} from "@dapr/dapr";

export const DaprClientProvider = {
    provide: DaprClient,
    useFactory: async (
        config: DaprCommsConfigurationService
    ): Promise<DaprClient> => {
        try {
            const client = new DaprClient(
                config.daprSidecarHost,
                config.daprSidecarPort
            );

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
            return client;
        } catch (error) {
            console.error("Couldn't start dappr client", error);
            // maybe even process exit here
            throw error;
        }
    },
    inject: [DaprCommsConfigurationService],
};
