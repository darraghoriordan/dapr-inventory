import {registerAs} from "@nestjs/config";

export default registerAs("daprcomms", () => ({
    daprApiSecret: process.env.DAPR_API_SECRET,
    daprSidecarHost: process.env.DAPR_SIDECAR_HOST,
    daprSidecarPort: process.env.DAPR_SIDECAR_PORT,
}));
