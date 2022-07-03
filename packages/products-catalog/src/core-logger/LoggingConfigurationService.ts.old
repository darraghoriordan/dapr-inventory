import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {IsBoolean, IsDefined, IsString} from "class-validator";
import {ValidatedConfigurationService} from "../core-config/ValidatedConfigurationService";

@Injectable()
export class LoggingConfigurationService extends ValidatedConfigurationService {
    constructor(private configService: ConfigService) {
        super();
    }

    @IsDefined()
    @IsBoolean()
    get shouldLogForDevelopment(): boolean {
        return this.configService.get<string>("logging.nodeEnv") === "dev";
    }

    @IsDefined()
    @IsString()
    get seqUrl(): string {
        return this.configService.get<string>("logging.seqUrl") || "http://seq";
    }

    @IsString()
    @IsDefined()
    get loggerName(): string {
        return (
            this.configService.get<string>("logging.loggerName") ||
            "DefaultLogger"
        );
    }
}
