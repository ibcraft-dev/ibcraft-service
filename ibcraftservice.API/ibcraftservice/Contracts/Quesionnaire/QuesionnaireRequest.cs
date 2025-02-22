using System.ComponentModel.DataAnnotations;

namespace ibcraftservice.Contracts.Quesionnaire
{
    public record QuesionnaireRequest(
            [Required] int Age,
            [Required] string playingTime,
            [Required] bool AcceptRule,
            [Required] bool PlayingServer,
            [Required] bool LicenseMinecraft,
            [Required] int BuildingLevel,
            [Required] int AdequacyLevel,
            [Required] string Discription
        );

}
