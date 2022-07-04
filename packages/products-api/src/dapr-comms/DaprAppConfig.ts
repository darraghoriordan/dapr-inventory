import {DaprClient} from "@dapr/dapr";
import {Injectable} from "@nestjs/common";
import {
    IsBoolean,
    IsDefined,
    IsInt,
    IsString,
    validateOrReject,
} from "class-validator";

export type AppVariables = {
    webPort: string;
    shouldLogForDevelopment: string;
    appTitle: string;
    awsAccessKeyId: string;
    awsDefaultRegion: string;
    awsSecretAccessKey: string;
    dynamoCreateTables: string;
    dynamoRegion: string;
    dynamoUrl: string;
    loggerName: string;
    seqUrl: string;
};

@Injectable()
class DaprAppConfig {
    private _secretsCache?: AppVariables;

    constructor(private daprClient: DaprClient) {}

    public async init() {
        this._secretsCache = (await this.daprClient.secret.get(
            "daprinventory-secretstore",
            "productsApi"
        )) as AppVariables;

        // validate maybe
        return validateOrReject(this);
    }

    @IsDefined()
    @IsInt()
    get webPort(): number {
        return Number.parseInt(this._secretsCache?.webPort || "");
    }

    @IsDefined()
    @IsBoolean()
    get shouldLogForDevelopment(): boolean {
        return this._secretsCache?.shouldLogForDevelopment === "true" || false;
    }

    @IsDefined()
    @IsString()
    get appTitle(): string | undefined {
        return this._secretsCache?.appTitle;
    }

    @IsDefined()
    @IsString()
    get awsAccessKeyId(): string | undefined {
        return this._secretsCache?.awsAccessKeyId;
    }

    @IsDefined()
    @IsString()
    get awsDefaultRegion(): string | undefined {
        return this._secretsCache?.awsDefaultRegion;
    }
    @IsDefined()
    @IsString()
    get awsSecretAccessKey(): string | undefined {
        return this._secretsCache?.awsSecretAccessKey;
    }
    @IsDefined()
    @IsBoolean()
    get dynamoCreateTables(): boolean {
        return this._secretsCache?.dynamoCreateTables == "true" || false;
    }
    @IsDefined()
    @IsString()
    get dynamoRegion(): string | undefined {
        return this._secretsCache?.dynamoRegion;
    }
    @IsDefined()
    @IsString()
    get dynamoUrl(): string | undefined {
        return this._secretsCache?.dynamoUrl;
    }
    @IsDefined()
    @IsString()
    get loggerName(): string | undefined {
        return this._secretsCache?.loggerName;
    }
    @IsDefined()
    @IsString()
    get seqUrl(): string | undefined {
        return this._secretsCache?.seqUrl;
    }
}

export default DaprAppConfig;
