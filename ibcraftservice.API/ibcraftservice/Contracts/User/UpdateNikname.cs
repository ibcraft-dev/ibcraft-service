using System.ComponentModel.DataAnnotations;

namespace ibcraftservice.Contracts.User
{
    public record UpdateNikname(
        [Required] string newNikname 
        );

}
