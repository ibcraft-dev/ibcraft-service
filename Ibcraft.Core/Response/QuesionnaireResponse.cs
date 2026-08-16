using System.ComponentModel.DataAnnotations;

namespace ibcraftservice.Core.Quesionnaire
{
    public record QuesionnaireResponse(
            [Required] Guid Id,
            [Required] Guid UserId,
            string? UserName,
            [Required] int Age,
            [Required] string PlayingTime,
            [Required] bool AcceptRule,
            [Required] bool PlayingServer,
            [Required] bool LicenseMinecraft,
            [Required] int BuildingLevel,
            [Required] int AdequacyLevel,
            [Required] string Discription,
            [Required] string Status
        );

}
