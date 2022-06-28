import {ClassSerializerInterceptor, ValidationPipe} from "@nestjs/common";
import {NestFactory, Reflector} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {CoreConfigurationService} from "./core-config/CoreConfigurationService";
import CoreLoggerService from "./core-logger/CoreLoggerService";
import {LoggingInterceptor} from "./core-logger/LoggingInterceptor";
import {MainModule} from "./main.module";

void (async () => {
    try {
        const app = await NestFactory.create(MainModule);
        const loggerService = app.get(CoreLoggerService);
        const configService = app.get(CoreConfigurationService);
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
            .setTitle(configService.appTitle)
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
