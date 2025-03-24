
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Ibcraft.DataAccess.Entity
{

    public class UserEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public Guid Id { get; set; }
        public string? Nikname { get; set; }

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
        public string UserAvatar { get; set; } = string.Empty;

        public bool IsEmailConfirmed { get; set; }
        public string EmailConfirmedToken { get; set; } = string.Empty;
        public string PasswordResetToken { get; set; } = string.Empty;
        public DateTime? TokenExpiration { get; set; }
        public DateTime Created_at { get; set; }

        public ICollection<RoleEntity> Roles { get; set; } = [];

        public List<QuestionnairePlayerEntity> Questions { get; set; } = [];
    }
}
