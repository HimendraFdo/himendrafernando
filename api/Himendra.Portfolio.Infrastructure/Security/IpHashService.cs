using System.Security.Cryptography;
using System.Text;
using Himendra.Portfolio.Application.Security;
using Himendra.Portfolio.Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace Himendra.Portfolio.Infrastructure.Security;

public sealed class IpHashService(
    IOptions<SecurityOptions> options) : IIpHashService
{
    private const string DevelopmentFallbackSalt = "development-ip-hash-salt";

    public string? HashIpAddress(string? ipAddress)
    {
        if (string.IsNullOrWhiteSpace(ipAddress))
        {
            return null;
        }

        var salt = options.Value.IpHashSalt;

        if (string.IsNullOrWhiteSpace(salt))
        {
            if (options.Value.RequireIpHashSalt)
            {
                throw new InvalidOperationException("Security:IpHashSalt must be configured in production.");
            }

            salt = DevelopmentFallbackSalt;
        }

        var input = $"{salt}:{ipAddress.Trim()}";
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));

        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
