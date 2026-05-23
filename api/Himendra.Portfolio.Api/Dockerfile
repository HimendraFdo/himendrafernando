FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Himendra.Portfolio.sln ./
COPY NuGet.Config ./
COPY api/Himendra.Portfolio.Api/Himendra.Portfolio.Api.csproj api/Himendra.Portfolio.Api/
COPY api/Himendra.Portfolio.Application/Himendra.Portfolio.Application.csproj api/Himendra.Portfolio.Application/
COPY api/Himendra.Portfolio.Domain/Himendra.Portfolio.Domain.csproj api/Himendra.Portfolio.Domain/
COPY api/Himendra.Portfolio.Infrastructure/Himendra.Portfolio.Infrastructure.csproj api/Himendra.Portfolio.Infrastructure/
COPY api/Himendra.Portfolio.Tests/Himendra.Portfolio.Tests.csproj api/Himendra.Portfolio.Tests/

RUN dotnet restore api/Himendra.Portfolio.Api/Himendra.Portfolio.Api.csproj

COPY api/ api/
RUN dotnet publish api/Himendra.Portfolio.Api/Himendra.Portfolio.Api.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_FORWARDEDHEADERS_ENABLED=true \
    DOTNET_EnableDiagnostics=0

RUN addgroup --system appgroup \
    && adduser --system --ingroup appgroup --home /app appuser

COPY --from=build /app/publish ./
RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 8080

ENTRYPOINT ["dotnet", "Himendra.Portfolio.Api.dll"]
