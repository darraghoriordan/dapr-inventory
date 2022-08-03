//import {ZipkinExporter} from "@opentelemetry/exporter-zipkin";
//import {registerInstrumentations} from "@opentelemetry/instrumentation";
import {W3CTraceContextPropagator} from "@opentelemetry/core";
import {NodeTracerProvider} from "@opentelemetry/sdk-trace-node";
import {BatchSpanProcessor} from "@opentelemetry/sdk-trace-base";
import {registerInstrumentations} from "@opentelemetry/instrumentation";
import {diag, DiagConsoleLogger, DiagLogLevel} from "@opentelemetry/api";
import {Resource} from "@opentelemetry/resources";
//import {SemanticResourceAttributes} from "@opentelemetry/semantic-conventions";
import {getNodeAutoInstrumentations} from "@opentelemetry/auto-instrumentations-node";
import {SemanticResourceAttributes} from "@opentelemetry/semantic-conventions";
import {HttpInstrumentation} from "@opentelemetry/instrumentation-http";
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-http";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);
export const initTelemetry = (config: {
    appName: string;
    telemetryUrl: string;
}): void => {
    const exporter = new OTLPTraceExporter({
        // optional - url default value is http://localhost:4318/v1/traces
        url: config.telemetryUrl, // "http://otel-collector:4318/v1/traces",
    });
    // const exporter = new ZipkinExporter({
    //     serviceName: "zipkin instance",
    //     url: config.telemetryUrl,
    // });

    const resource = Resource.default().merge(
        new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: config.appName,
            application: config.appName,
        })
    );

    const provider = new NodeTracerProvider({resource});
    provider.addSpanProcessor(new BatchSpanProcessor(exporter));

    // Initialize the provider - context manager default is OK
    provider.register({
        propagator: new W3CTraceContextPropagator(),
    });

    // Registering instrumentations / plugins
    registerInstrumentations({
        instrumentations: getNodeAutoInstrumentations({
            "@opentelemetry/instrumentation-http": {enabled: false},
        }).concat(
            // we want to ignore seq so load this in a special way
            new HttpInstrumentation({
                enabled: true,
                ignoreOutgoingRequestHook: (req) => {
                    return (
                        (req && req.hostname?.includes("seq")) ||
                        req.host?.includes("seq") ||
                        false
                    );
                },
            })
        ),
    });
};
