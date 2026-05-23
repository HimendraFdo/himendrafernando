namespace Himendra.Portfolio.Infrastructure.Options;

public sealed class SecurityOptions
{
    public const string SectionName = "Security";

    public string IpHashSalt { get; set; } = string.Empty;

    public bool RequireIpHashSalt { get; set; }
}
