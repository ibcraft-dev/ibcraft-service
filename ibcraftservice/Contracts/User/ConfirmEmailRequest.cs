using System.ComponentModel.DataAnnotations;

namespace ibcraftservice.Contracts.User
{
    public record ConfirmEmailRequest (
        [Required] string Email,
        [Required] string Token
        );
    
}
