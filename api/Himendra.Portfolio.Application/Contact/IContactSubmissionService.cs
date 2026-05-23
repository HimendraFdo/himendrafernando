namespace Himendra.Portfolio.Application.Contact;

public interface IContactSubmissionService
{
    Task<SubmitContactResponse> SubmitAsync(
        SubmitContactRequest request,
        string? sourceIpAddress,
        string? userAgent,
        CancellationToken cancellationToken);
}
