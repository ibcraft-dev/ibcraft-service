

namespace Ibcraft.Core.Module
{
    public class QuestionnairePlayerModule 
    {
        private QuestionnairePlayerModule(Guid id, Guid userid, int Age, bool acceptRole, bool playingServer) { }


        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public int Age { get; private set; }
        public bool AcceptRule { get; private set; }
        public bool PlayingServer { get; private set; }
        public bool LicenseMinecraft { get; private set; }
        public int BuildingLevel { get; private set; }
        public int AdequacyLevel { get; private set; }
        public string Discription { get; private set; } = string.Empty;
        public string Status { get; private set; } = "Pending";
    }
}
