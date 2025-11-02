using System.ComponentModel.DataAnnotations;

namespace ibcraftservice.Contracts.User
{
    public record RegisterUserRequest(
        [Required] string Nikname,
        [Required] string Password,
        [Required] string ConfirmPassword,
        [Required] string Email
        );

}
