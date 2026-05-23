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

## Contact API

Submit public portfolio contact messages:

```http
POST /api/contact
Content-Type: application/json
```

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello, I would like to talk about a project."
}
```

Successful requests return `201 Created`:

```json
{
  "id": "generated-submission-id",
  "status": "Received",
  "message": "Thanks for reaching out. I will get back to you soon."
}
```

Validation failures return `400 Bad Request` with validation problem details. Public validation rules:

- `name`: required, maximum 120 characters
- `email`: required, valid email address, maximum 254 characters
- `message`: required, minimum 10 characters, maximum 4000 characters

Input values are trimmed before validation and storage. Public clients cannot set internal fields such as `id`, `status`, `createdAtUtc`, or `reviewedAtUtc`.

The endpoint uses the stricter `Contact` rate-limit policy. Repeated submissions over the configured limit return `429 Too Many Requests`.

For privacy, the API stores a salted hash of the source IP address rather than the raw IP address. Configure a real production salt with `Security__IpHashSalt`; do not commit salts or secrets.

## Configuration

Use `appsettings.Development.json` or environment variables for local overrides. Do not commit production secrets. Production secrets should be supplied through environment variables or AWS Secrets Manager.
