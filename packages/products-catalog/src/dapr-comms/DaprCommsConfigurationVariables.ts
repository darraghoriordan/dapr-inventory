import {registerAs} from "@nestjs/config";

export default registerAs("daprcomms", () => ({
    daprApiSecret: process.env.DAPR_API_SECRET,
    daprServerHost: process.env.DAPR_SERVER_HOST,
    daprServerPort: process.env.DAPR_SERVER_PORT,
    daprSidecarHost: process.env.DAPR_SIDECAR_HOST,
    daprSidecarPort: process.env.DAPR_SIDECAR_PORT,
}));
