using System.ComponentModel.DataAnnotations;

namespace ibcraftservice.Core.Quesionnaire
{
    public record QuesionnaireRequest(
            [Required] int Age,
            [Required] string PlayingTime,
            [Required] bool AcceptRule,
            [Required] bool PlayingServer,
            [Required] bool LicenseMinecraft,
            [Required] int BuildingLevel,
            [Required] int AdequacyLevel,
            [Required] string Description
        );

}
