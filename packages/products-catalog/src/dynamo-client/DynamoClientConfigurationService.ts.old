/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {IsBoolean, IsDefined, IsString} from "class-validator";
import {ValidatedConfigurationService} from "../core-config/ValidatedConfigurationService";

@Injectable()
export class DynamoClientConfigurationService extends ValidatedConfigurationService {
    constructor(private configService: ConfigService) {
        super();
    }

    @IsDefined()
    @IsString()
    get dynamoUrl(): string {
        return this.configService.get<string>("dynamoclient.dynamoUrl")!;
    }

    @IsDefined()
    @IsString()
    get dynamoRegion(): string {
        return this.configService.get<string>("dynamoclient.dynamoRegion")!;
    }

    @IsDefined()
    @IsBoolean()
    get shouldCreateTables(): boolean {
        return (
            this.configService.get<string>(
                "dynamoclient.shouldCreateTables"
            ) === "true" || false
        );
    }
}
