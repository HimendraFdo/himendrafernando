using System.ComponentModel.DataAnnotations;

namespace Himendra.Portfolio.Application.Contact;

public sealed record SubmitContactRequest(
    [property: Required]
    [property: MaxLength(120)]
    string? Name,
    [property: Required]
    [property: MaxLength(254)]
    [property: EmailAddress]
    string? Email,
    [property: Required]
    [property: MinLength(10)]
    [property: MaxLength(4000)]
    string? Message)
{
    public SubmitContactRequest Trimmed()
    {
        return this with
        {
            Name = Name?.Trim(),
            Email = Email?.Trim(),
            Message = Message?.Trim()
        };
    }
}
