import {DaprCommsConfigurationService} from "./DaprCommsConfigurationService";
import CoreLoggerService from "../core-logger/CoreLoggerService";
import {DaprServer} from "@dapr/dapr";

export const DaprServerProvider = {
    provide: DaprServer,
    useFactory: async (
        config: DaprCommsConfigurationService
    ): Promise<DaprServer> => {
        try {
            const server = new DaprServer(
                config.daprServerHost,
                config.daprServerPort,
                config.daprSidecarHost,
                config.daprSidecarPort
            );

            // subscribe to things here

            await server.start();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
            return server;
        } catch (error) {
            console.error("Failed to start dapr server", error);
            throw error;
        }
    },
    inject: [DaprCommsConfigurationService, CoreLoggerService],
};
