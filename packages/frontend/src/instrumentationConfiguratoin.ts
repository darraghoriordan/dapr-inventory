import {WebTracerProvider} from "@opentelemetry/sdk-trace-web";
import {BatchSpanProcessor} from "@opentelemetry/sdk-trace-base";
//import {ZipkinExporter} from "@opentelemetry/exporter-zipkin";
import {W3CTraceContextPropagator} from "@opentelemetry/core";
import {registerInstrumentations} from "@opentelemetry/instrumentation";
import {SemanticResourceAttributes} from "@opentelemetry/semantic-conventions";
import {Resource} from "@opentelemetry/resources";
import {ZoneContextManager} from "@opentelemetry/context-zone";
import {FetchInstrumentation} from "@opentelemetry/instrumentation-fetch";
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-http";

export const initInstrumentation = () => {
    const exporter = new OTLPTraceExporter({
        // optional - url default value is http://localhost:4318/v1/traces
        url: `${import.meta.env.VITE_API_HOST}/trace`,
    });

    // const exporter = new ZipkinExporter({
    //     serviceName: "zipkin instance",
    //     url: import.meta.env.VITE_ZIPKIN_URL,
    // });

    const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: "DaprInventoryClient",
        application: "DaprInventoryClient",
    });

    const provider = new WebTracerProvider({resource});
    provider.addSpanProcessor(new BatchSpanProcessor(exporter));

    // Initialize the provider
    provider.register({
        propagator: new W3CTraceContextPropagator(),
        contextManager: new ZoneContextManager(),
    });

    // Registering instrumentations / plugins
    registerInstrumentations({
        instrumentations: [
            new FetchInstrumentation({
                propagateTraceHeaderCorsUrls: [/.+/g], // this is too broad for production
                clearTimingResources: true,
            }),
        ],
    });
};
