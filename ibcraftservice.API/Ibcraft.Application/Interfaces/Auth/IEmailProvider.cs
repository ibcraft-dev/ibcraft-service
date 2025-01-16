
namespace Ibcraft.Application.Interfaces.Auth
{
    public interface IEmailProvider
    {
        Task SendEmailAsync(string recipientEmail, string subject, string body);
    }
}