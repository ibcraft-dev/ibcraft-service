using System.ComponentModel.DataAnnotations;

namespace ibcraftservice.Contracts.User
{
    public record LoginUserRequest(
            [Required] string Email,
            [Required] string Password
        );

}