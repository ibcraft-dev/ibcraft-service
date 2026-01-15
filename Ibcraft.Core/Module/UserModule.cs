
namespace Ibcraft.Core.Module
{
    public class UserModule
    {
        public const int MAX_NIKNAME_LENGTH = 60;
        public const int DEFAULT_LENGTH_PASSWORD = 8;

        public UserModule(string nikname,
            string email,
            string userAvatar,
            bool isEmailConfirmed, 
            string tokenEmail,
            string tokenReset,
            DateTime created_at)
        {
            Nikname = nikname;
            Email = email;
            IsEmailConfirmed = isEmailConfirmed;
            UserAvatar = userAvatar;
            Created_at = created_at;
            EmailConfirmedToken = tokenEmail;
            PasswordReset = tokenReset;
        }

        public string Nikname { get; private set; } = string.Empty;
        public string Email { get; private set; } = string.Empty;
        public string Password { get; private set; } = string.Empty;
        public string UserAvatar { get; private set; } = string.Empty;
        public bool IsEmailConfirmed { get; private set; }
        public string EmailConfirmedToken { get; set; } = string.Empty;
        public string PasswordReset { get; set; } = string.Empty;
        public DateTime Created_at {  get; private set; }

        private static bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            } catch { return false; }
        }

        public static UserModule Create(string nikname, string email)
        {

            if (nikname.Length > MAX_NIKNAME_LENGTH) throw new ArgumentException("Nickname more than 60 characters");

            if (string.IsNullOrEmpty(email)) throw new ArgumentException("Email cannot be null!");

            var user = new UserModule(nikname, email, string.Empty, false, Guid.NewGuid().ToString(), string.Empty, DateTime.Now);
            return user;
                
        }

        
    }
}
