

using Ibcraft.Core.Exceptions;

namespace Ibcraft.Application.Entity
{
    public static class QuestionnairePlayerEntityFactory
    {
        public static QuestionnairePlayerEntity Create(
                Guid userid, 
                int age,
                string playingTime,
                bool acceptRule,
                bool playingServer,
                bool licenseMinecraft,
                int buildingLevel,
                int adequacyLevel,
                string description
            )
        {
            if (age < 13) throw new AgeUserFailedException("The user turned out to be very young");
            if (string.IsNullOrEmpty(description)) throw new ArgumentException("Description cannot be null");
            var questionnaire = new QuestionnairePlayerEntity
            {
                Id = Guid.NewGuid(),
                UserId = userid,
                Age = age,
                PlayingTime = playingTime,
                AcceptRule = acceptRule,
                PlayingServer = playingServer,
                LicenseMinecraft = licenseMinecraft,
                BuildingLevel = buildingLevel,
                AdequacyLevel = adequacyLevel,
                Description = description
            };
            return questionnaire;
        }
    }
    public class QuestionnairePlayerEntity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public UserEntity? User { get; set; }
        public int Age { get; set; }
        public string PlayingTime { get; set; } = string.Empty;
        public bool AcceptRule { get; set; }
        public bool PlayingServer { get; set; }
        public bool LicenseMinecraft { get; set; }
        public int BuildingLevel { get; set; }
        public int AdequacyLevel { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
    }
}
