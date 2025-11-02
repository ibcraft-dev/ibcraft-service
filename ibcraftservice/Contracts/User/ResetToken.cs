using System.ComponentModel.DataAnnotations;

namespace ibcraftservice.Contracts.User
{
    public record ResetToken(
            [Required] string email,
            [Required] string token
        );

}
