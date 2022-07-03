/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {IsDefined, IsString} from "class-validator";
import {ValidatedConfigurationService} from "../core-config/ValidatedConfigurationService";

@Injectable()
export class DaprCommsConfigurationService extends ValidatedConfigurationService {
    constructor(private configService: ConfigService) {
        super();
    }

    @IsDefined()
    @IsString()
    get daprApiSecret(): string {
        return this.configService.get<string>("daprcomms.daprApiSecret")!;
    }
    @IsDefined()
    @IsString()
    get daprServerHost(): string {
        return this.configService.get<string>("daprcomms.daprServerHost")!;
    }
    @IsDefined()
    @IsString()
    get daprServerPort(): string {
        return this.configService.get<string>("daprcomms.daprServerPort")!;
    }
    @IsDefined()
    @IsString()
    get daprSidecarHost(): string {
        return this.configService.get<string>("daprcomms.daprSidecarHost")!;
    }
    @IsDefined()
    @IsString()
    get daprSidecarPort(): string {
        return this.configService.get<string>("daprcomms.daprSidecarPort")!;
    }
}
