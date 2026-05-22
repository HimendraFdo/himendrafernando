namespace Himendra.Portfolio.Api.Options;

public sealed class RateLimitingOptions
{
    public const string SectionName = "RateLimiting";

    public int GlobalPermitLimit { get; init; } = 100;

    public int GlobalWindowSeconds { get; init; } = 60;

    public int ContactPermitLimit { get; init; } = 5;

    public int ContactWindowSeconds { get; init; } = 60;
}
