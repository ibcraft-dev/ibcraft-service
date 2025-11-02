

using Microsoft.Extensions.Options;
using System.Net.Mail;
using System.Net;
using Ibcraft.Application.Interfaces.Auth;

namespace Ibcraft.Infrastructure
{
    public class EmailProvider(IOptions<EmailOptions> options) : IEmailProvider
    {
        private readonly EmailOptions _options = options.Value;

        public async Task SendEmailAsync(string recipientEmail, string subject, string body)
        {
            using (var client = new SmtpClient(_options.SMTPHost, _options.SMTPPort))
            {
                client.Credentials = new NetworkCredential(_options.SenderEmail, _options.SenderPassword);
                client.EnableSsl = true;

                var mailMessage = new MailMessage(_options.SenderEmail, recipientEmail, subject, body);
                await client.SendMailAsync(mailMessage);
            }
        }

    }
}
