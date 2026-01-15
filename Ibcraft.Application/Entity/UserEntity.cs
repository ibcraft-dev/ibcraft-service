
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Ibcraft.Application.Entity
{
    public static class UserEntityFactory
    {
        public const int MAX_NIKNAME_LENGTH = 60;
        public const int DEFAULT_LENGTH_PASSWORD = 8;

        public static UserEntity Create(string nikname,  string email)
        {
            if (nikname.Length > MAX_NIKNAME_LENGTH) throw new ArgumentException("Nickname more than 60 characters");
            if (string.IsNullOrEmpty(email)) throw new ArgumentException("Email cannot be null!");
            
            var user = new UserEntity
            {
                Nikname = nikname,
                Email = email,
                IsEmailConfirmed = false,
                EmailConfirmedToken = Guid.NewGuid().ToString(),
                Created_at = DateTime.Now
            };
            return user;
        }
    }


    public class UserEntity : IdentityUser<Guid>
    {
        [Key]
        public string? Nikname { get; set; }
        public string UserAvatar { get; set; } = string.Empty;
        public bool IsEmailConfirmed { get; set; } = true;
        public string EmailConfirmedToken { get; set; } = string.Empty;
        public string PasswordResetToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime? TokenExpiration { get; set; }
        public DateTime Created_at { get; set; }

        public List<QuestionnairePlayerEntity> Questions { get; set; } = [];
    }
}
