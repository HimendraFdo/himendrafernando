# Himendra Portfolio API

ASP.NET Core backend for the portfolio site.

## Local API

Run the API project from the repository root:

```bash
dotnet run --project api/Himendra.Portfolio.Api
```

The local launch profile uses the URLs defined in `api/Himendra.Portfolio.Api/Properties/launchSettings.json`.

## CORS

CORS is restricted to configured frontend origins:

```json
{
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173"]
  }
}
```

If no origins are configured in development, the API allows the local Vite origin `http://localhost:5173`. Production origins must be configured explicitly.

## Rate Limiting

The API uses ASP.NET Core built-in rate limiting.

Defaults:

- Global API limit: 100 requests per 60 seconds per authenticated user or IP address.
- Contact endpoint policy: 5 requests per 60 seconds per authenticated user or IP address.

Override these values with `RateLimiting__GlobalPermitLimit`, `RateLimiting__GlobalWindowSeconds`, `RateLimiting__ContactPermitLimit`, and `RateLimiting__ContactWindowSeconds`.

## Configuration

Use `appsettings.Development.json` or environment variables for local overrides. Do not commit production secrets. Production secrets should be supplied through environment variables or AWS Secrets Manager.
