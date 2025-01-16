

namespace Ibcraft.DataAccess.Entity
{
    public class QuestionnairePlayerEntity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public UserEntity? User { get; set; }
        public int Age { get; set; }
        public bool AcceptRule { get; set; }
        public bool PlayingServer { get; set; }
        public bool LicenseMinecraft { get; set; }
        public int BuildingLevel { get; set; }
        public int AdequacyLevel { get; set; }
        public string Discription { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
    }
}
