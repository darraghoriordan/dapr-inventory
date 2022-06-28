/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {IsBoolean, IsDefined, IsInt, IsString} from "class-validator";
import {ValidatedConfigurationService} from "./ValidatedConfigurationService";

@Injectable()
export class CoreConfigurationService extends ValidatedConfigurationService {
    constructor(private configService: ConfigService) {
        super();
    }

    @IsDefined()
    @IsInt()
    get webPort(): number {
        return Number.parseInt(
            this.configService.get<string>("core.webPort")!,
            10
        );
    }

    @IsDefined()
    @IsBoolean()
    get shouldLogForDevelopment(): boolean {
        return this.configService.get<string>("logging.nodeEnv") === "dev";
    }
    
    @IsDefined()
    @IsString()
    get appTitle(): string {
        return this.configService.get<string>(
            "core.appTitle"
        )!;
    }

    @IsDefined()
    @IsString()
    get nodeEnv(): string {
        return this.configService.get<string>("core.nodeEnv")!;
    }
}
