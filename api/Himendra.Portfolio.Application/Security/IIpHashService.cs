namespace Himendra.Portfolio.Application.Security;

public interface IIpHashService
{
    string? HashIpAddress(string? ipAddress);
}
