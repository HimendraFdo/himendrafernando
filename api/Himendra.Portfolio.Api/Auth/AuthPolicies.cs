using System.Security.Claims;

namespace Himendra.Portfolio.Api.Auth;

public static class AuthPolicies
{
    public const string AdminOnly = "AdminOnly";
    public const string AdminRoleValue = "Admin";

    public static bool IsAdmin(ClaimsPrincipal user)
    {
        return user.Claims.Any(claim =>
            IsAdminClaim(claim, "role") ||
            IsAdminClaim(claim, ClaimTypes.Role) ||
            IsAdminClaim(claim, "cognito:groups"));
    }

    private static bool IsAdminClaim(Claim claim, string claimType)
    {
        return string.Equals(claim.Type, claimType, StringComparison.OrdinalIgnoreCase) &&
            claim.Value
                .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Any(value => string.Equals(value, AdminRoleValue, StringComparison.OrdinalIgnoreCase));
    }
}
