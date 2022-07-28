import {initTelemetry} from "./core-config/OpenTelemetry";
// ----- this has to come before imports! -------
initTelemetry({
    appName: process.env.OPEN_TELEMETRY_APP_NAME || "",
    telemetryUrl: process.env.OPEN_TELEMETRY_URL || "",
});
console.log("initialised telemetry");
// -------------

import {ClassSerializerInterceptor, ValidationPipe} from "@nestjs/common";
import {NestFactory, Reflector} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import CoreLoggerService from "./core-logger/CoreLoggerService";
import {LoggingInterceptor} from "./core-logger/LoggingInterceptor";
import {MainModule} from "./main.module";
import DaprAppConfig from "./dapr-comms/DaprAppConfig";
import * as bodyParser from "body-parser";

console.log("running nest app creation");
void (async () => {
    try {
        console.log("creating main module...");
        const app = await NestFactory.create(MainModule, {cors: true}); // we allow all cors sources here. This will be controlled at the gateway.
        console.log("main module created.");

        // this is added here to process Dapr.IO publish with content-header: appliction/cloudevents+json. If not included body of post request will be {}
        // must support cloud events type
        app.use(bodyParser.json({type: "application/cloudevents+json"}));
        // add this as other post with content-type: json will fail like login will fail due to bodyPaser code above
        app.use(bodyParser.json());
        const loggerService = app.get(CoreLoggerService);
        const configService = app.get(DaprAppConfig);
        app.useLogger(loggerService);

        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                skipMissingProperties: false,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
            })
        );
        app.useGlobalInterceptors(
            new ClassSerializerInterceptor(app.get(Reflector)),
            new LoggingInterceptor(loggerService)
        );

        const config = new DocumentBuilder()
            .addBearerAuth()
            .setTitle(configService.appTitle!)
            .setDescription("Describes the backend api")
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup("swagger", app, document);

        loggerService.log(
            `will listen on port ${configService.webPort} (DEV link: http://localhost:${configService.webPort} )`
        );

        await app.listen(configService.webPort);
    } catch (initialisationError) {
        // we don't use logger service in case that is broken at initialisation
        console.error(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `Failed to initialize, due to: ${initialisationError}`
        );
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    }
})();
