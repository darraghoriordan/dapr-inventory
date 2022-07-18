need `dotnet tool install --global dotnet-ef` for running migrations

then change the db context to use the direct local database connection string (see commented code)

then use `dotnet ef --startup-project ./ migrations add myMigration01 --output-dir Infrastructure/Migrations`
