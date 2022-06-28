import {registerAs} from "@nestjs/config";

export default registerAs("core", () => ({
    webPort: process.env.WEB_PORT,
    nodeEnv: process.env.NODE_ENV,
    appTitle: process.env.APP_TITLE
}));
