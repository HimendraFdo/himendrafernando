namespace Himendra.Portfolio.Application.Contact;

public sealed record SubmitContactResponse(
    Guid Id,
    string Status,
    string Message);
