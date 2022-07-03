import {ZipkinExporter} from "@opentelemetry/exporter-zipkin";
import {registerInstrumentations} from "@opentelemetry/instrumentation";
import {W3CTraceContextPropagator} from "@opentelemetry/core";
import {NodeTracerProvider} from "@opentelemetry/sdk-trace-node";
import {SimpleSpanProcessor} from "@opentelemetry/sdk-trace-base";
import opentelemetry, {
    Tracer,
    diag,
    DiagConsoleLogger,
    DiagLogLevel,
} from "@opentelemetry/api";
import {Resource} from "@opentelemetry/resources";
import {SemanticResourceAttributes} from "@opentelemetry/semantic-conventions";
import {getNodeAutoInstrumentations} from "@opentelemetry/auto-instrumentations-node";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);
export const initTelemetry = (config: {
    appName: string;
    zipkinUrl: string;
}): Tracer => {
    const exporter = new ZipkinExporter({
        serviceName: "zipkin instance",
        url: config.zipkinUrl,
    });
    const resources = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: config.appName,
        application: config.appName,
    });
    // const prometheusExporter = new PrometheusExporter({startServer: true});
    // Create and configure NodeTracerProvider
    const provider = new NodeTracerProvider({resource: resources});
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    // Initialize the provider
    provider.register({propagator: new W3CTraceContextPropagator()});

    registerInstrumentations({
        instrumentations: getNodeAutoInstrumentations(),
    });

    //   opentelemetry.trace.setGlobalTracerProvider(provider);
    return opentelemetry.trace.getTracer("open telem initialiser");
};
