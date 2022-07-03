/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Injectable, LoggerService} from "@nestjs/common";
import winston from "winston";
import {SeqTransport} from "@datalust/winston-seq";
import DaprAppConfig from "../dapr-comms/DaprAppConfig";

@Injectable()
export default class CoreLoggerService implements LoggerService {
    private logger: winston.Logger;

    constructor(private readonly daprAppConfig: DaprAppConfig) {
        const seqTransport = new SeqTransport({
            serverUrl: this.daprAppConfig.seqUrl,
            format: winston.format.combine(
                /* This is required to get errors to log with stack traces. See https://github.com/winstonjs/winston/issues/1498 */
                winston.format.errors({stack: true}),
                winston.format.json()
            ),
            handleExceptions: true,
            handleRejections: true,
            apiKey: undefined,
            onError: (e) => {
                console.error(e);
            },
        });
        this.logger = winston.createLogger({
            defaultMeta: {["ApplicationName"]: this.daprAppConfig.loggerName},
            level: this.daprAppConfig.shouldLogForDevelopment
                ? "debug"
                : "info",
            transports: [
                seqTransport,
                new winston.transports.Console({
                    format: this.daprAppConfig.shouldLogForDevelopment
                        ? winston.format.simple()
                        : winston.format.combine(
                              /* This is required to get errors to log with stack traces. See https://github.com/winstonjs/winston/issues/1498 */
                              winston.format.errors({stack: true}),
                              winston.format.json()
                          ),
                }),
            ],
        });
    }

    log(message: any, ...optionalParams: any[]) {
        if (typeof message === "string") {
            this.logger.info(message, ...optionalParams);
        } else {
            this.logger.info("obj: ", ...[message, optionalParams]);
        }
    }

    error(message: any, ...optionalParams: any[]) {
        if (typeof message === "string") {
            this.logger.error(message, ...optionalParams);
        } else {
            this.logger.error("obj: ", ...[message, optionalParams]);
        }
    }

    warn(message: any, ...optionalParams: any[]) {
        if (typeof message === "string") {
            this.logger.warn(message, ...optionalParams);
        } else {
            this.logger.warn("obj: ", ...[message, optionalParams]);
        }
    }

    debug(message: any, ...optionalParams: any[]) {
        if (typeof message === "string") {
            this.logger.debug(message, ...optionalParams);
        } else {
            this.logger.debug("obj: ", ...[message, optionalParams]);
        }
    }

    verbose(message: any, ...optionalParams: any[]) {
        if (typeof message === "string") {
            this.logger.debug(message, ...optionalParams);
        } else {
            this.logger.debug("obj: ", ...[message, optionalParams]);
        }
    }
}
