﻿// Only use in this file to avoid conflicts with Microsoft.Extensions.Logging
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Npgsql;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Darragh.DaprInventory.Services.Inventory.API.Healthchecks;
using Serilog.Enrichers.Span;
using OpenTelemetry.Logs;

namespace Darragh.DaprInventory.Services.Inventory.API;

public static class ProgramExtensions
{
    private const string AppName = "inventory-api";

    public static void AddConfigurationFromDapr(this WebApplicationBuilder builder)
    {
        try
        {
            var secretDescriptors = new List<DaprSecretDescriptor>{
        new DaprSecretDescriptor("inventoryApi",new Dictionary<string, string>(){ { "namespace", "daprinventory" } })};

            builder.Configuration.AddDaprSecretStore(
           "daprinventory-secretstore",
            secretDescriptors,
           new DaprClientBuilder().Build(), new TimeSpan(0, 0, 20));
        }
        catch (System.Exception)
        {
            //Log.Logger.Error("Couldn't get settings from dapr sidecar", error);
            throw;
        }
    }
    public static void AddCustomOpenTelemetry(this WebApplicationBuilder builder)
    {
        var url = builder.Configuration["OPEN_TELEMETRY_URL"];
        var appName = builder.Configuration["OPEN_TELEMETRY_APP_NAME"];
        builder.Services.AddOpenTelemetryTracing(tracerProviderBuilder =>
        {
            tracerProviderBuilder
            .AddOtlpExporter(c => { c.Endpoint = new Uri(url); c.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.Grpc; })
            //  .AddZipkinExporter(c => { c.Endpoint = new Uri(url); })
            //.AddConsoleExporter()
            .AddSource(appName)
            .SetResourceBuilder(
                ResourceBuilder.CreateDefault()
                    .AddService(serviceName: appName, serviceVersion: "1.0"))
            .AddHttpClientInstrumentation()
            .AddAspNetCoreInstrumentation()
            .AddNpgsql();
        });
    }

    public static void AddCustomHealthChecks(this WebApplicationBuilder builder) =>
    builder.Services.AddHealthChecks()
        .AddCheck("self", () => HealthCheckResult.Healthy())
        .AddCheck<DaprHealthCheck>("dapr");
    public static void AddCustomSerilog(this WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((webBuilderContext, loggingConfiguration) =>
        {
            var seqServerUrl = builder.Configuration["seqUrl"];

            loggingConfiguration
            .ReadFrom.Configuration(builder.Configuration)
            .WriteTo.Console()
            .WriteTo.Seq(seqServerUrl)
            .Enrich.WithDemystifiedStackTraces()
            .Enrich.FromLogContext()
            .Enrich.WithProperty("ApplicationName", AppName)
            .Enrich.WithSpan();
        });
    }

    public static void AddCustomSwagger(this WebApplicationBuilder builder) =>
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = $"{AppName}", Version = "v1" });
        });

    public static void UseCustomSwagger(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", $"{AppName} V1");
        });
    }

    public static void AddCustomDatabase(this WebApplicationBuilder builder)
    {

        builder.Services.AddDbContext<InventoryDbContext>(
            options => options.UseNpgsql(builder.Configuration["inventoryDbConnectionString"]));

        // uncomment for generating migrations - for local instance only - not a secret
        //    builder.Services.AddDbContext<InventoryDbContext>(
        /// options => options.UseNpgsql("Host=host.docker.internal;Port=5413;Database=InventoryDb;Username=postgres;Password=postgres"));
    }

    public static void ApplyDatabaseMigration(this WebApplication app)
    {
        // Apply database migration automatically. Note that this approach is not
        // recommended for production scenarios. Consider generating SQL scripts from
        // migrations instead.
        using var scope = app.Services.CreateScope();

        var retryPolicy = CreateRetryPolicy(app.Configuration);
        var context = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();

        retryPolicy.Execute(context.Database.Migrate);
    }

    private static Policy CreateRetryPolicy(IConfiguration configuration)
    {
        // Only use a retry policy if configured to do so.
        // When running in an orchestrator/K8s, it will take care of restarting failed services.
        if (bool.TryParse(configuration["RetryMigrations"], out bool retryMigrations))
        {
            return Policy.Handle<Exception>().
                WaitAndRetryForever(
                    sleepDurationProvider: retry => TimeSpan.FromSeconds(5),
                    onRetry: (exception, retry, timeSpan) =>
                    {
                        // logger.Warning(
                        //     exception,
                        //     "Exception {ExceptionType} with message {Message} detected during database migration (retry attempt {retry}, connection {connection})",
                        //     exception.GetType().Name,
                        //     exception.Message,
                        //     retry,
                        //     configuration["inventoryDbConnectionString"]);
                    }
                );
        }

        return Policy.NoOp();
    }
}
