import {ZipkinExporter} from "@opentelemetry/exporter-zipkin";
//import {registerInstrumentations} from "@opentelemetry/instrumentation";
import {W3CTraceContextPropagator} from "@opentelemetry/core";
import {NodeTracerProvider} from "@opentelemetry/sdk-trace-node";
import {BatchSpanProcessor} from "@opentelemetry/sdk-trace-base";

import opentelemetry, {
    Tracer,
    diag,
    DiagConsoleLogger,
    DiagLogLevel,
} from "@opentelemetry/api";
import {Resource} from "@opentelemetry/resources";
//import {SemanticResourceAttributes} from "@opentelemetry/semantic-conventions";
import {getNodeAutoInstrumentations} from "@opentelemetry/auto-instrumentations-node";
import {SemanticResourceAttributes} from "@opentelemetry/semantic-conventions";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);
export const initTelemetry = (config: {
    appName: string;
    zipkinUrl: string;
}): Tracer => {
    const tracerConfig = {
        instrumentations: getNodeAutoInstrumentations(),
        resource: Resource.default().merge(
            new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: config.appName,
                application: config.appName,
            })
        ),
    };
    const provider = new NodeTracerProvider(tracerConfig);
    const exporter = new ZipkinExporter({
        serviceName: "zipkin instance",
        url: config.zipkinUrl,
    });

    provider.addSpanProcessor(new BatchSpanProcessor(exporter));
    // Initialize the provider
    provider.register({
        propagator: new W3CTraceContextPropagator(),
    });

    return opentelemetry.trace.getTracer("open telem initialiser");
};
