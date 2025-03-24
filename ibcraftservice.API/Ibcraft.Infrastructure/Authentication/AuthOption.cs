namespace Ibcraft.Infrastructure.Authentication
{
    public class AuthOption
    {
        public string Issuer { get; set; } = string.Empty;
        public string Audience {  get; set; } = string.Empty;
        public string SecretKey {  get; set; } = string.Empty;
        public int ExpiresHours { get; set; }
    }
}
