using System.ComponentModel.DataAnnotations;

namespace ibcraftservice.Contracts.User
{
    public record UserResponse (
        [Required] Guid id,
        [Required] String name,
        [Required] String Email,
        [Required] String AvatarIco
        );

}
