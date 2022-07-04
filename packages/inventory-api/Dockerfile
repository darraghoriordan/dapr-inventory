#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.
ARG NET_IMAGE=6.0-bullseye-slim
FROM mcr.microsoft.com/dotnet/aspnet:${NET_IMAGE} AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:${NET_IMAGE} AS build
WORKDIR /src

COPY . .
RUN dotnet restore "Inventory.API.csproj"

FROM build AS publish
RUN dotnet publish --no-restore "Inventory.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Inventory.API.dll"]
