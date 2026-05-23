# Admin Authentication

Admin APIs use ASP.NET Core JWT bearer authentication plus the `AdminOnly` authorization policy.

## Configuration

Set JWT provider values with:

```json
{
  "Authentication": {
    "Authority": "",
    "Audience": "",
    "RequireHttpsMetadata": true
  }
}
```

Production should set `Authority` and `Audience` from the chosen OIDC/JWT provider, such as AWS Cognito. Keep real pool IDs, client IDs, domains, private keys, and secrets out of source control.

## Admin Claim

`AdminOnly` requires an authenticated user with an admin claim. The preferred claim is:

```text
role=Admin
```

The policy also accepts `cognito:groups` containing `Admin` so Cognito groups can be used without changing endpoint code.

## Endpoints

All admin endpoints require `Authorization: Bearer <token>` and the `AdminOnly` policy.

```http
GET /api/admin/contact-submissions?status=New&page=1&pageSize=20
GET /api/admin/contact-submissions/{id}
PATCH /api/admin/contact-submissions/{id}/status
```

Allowed status values are `New`, `Reviewed`, `Archived`, and `Spam`. Status updates write an audit log entry containing only the old and new status.

Anonymous requests receive `401 Unauthorized`. Authenticated users without the admin claim receive `403 Forbidden`.

## Local Tests

Automated tests use a test authentication handler that reads `X-Test-User` and `X-Test-Role` headers. No real Cognito resources or JWT signing keys are required for tests.

## Database Security

The application does not change row-level security policies for admin access in this task. Production database roles should continue to avoid superuser privileges and should grant admin reads/updates through least-privilege RLS policies.
