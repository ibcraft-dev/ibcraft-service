

namespace Ibcraft.Core.Module
{
    public class QuestionnairePlayerModule 
    {
        private QuestionnairePlayerModule(Guid id, 
            Guid userid, 
            int age, 
            bool acceptRole, 
            bool playingServer, 
            bool licenseMinecraft, 
            int buildingLevel, 
            int adequacyLevel,
            string discription,
            string status) {

            Id = id;
            UserId = userid;
            Age = age;
            AcceptRule = acceptRole;
            PlayingServer = playingServer;
            LicenseMinecraft = licenseMinecraft;
            BuildingLevel = buildingLevel;
            AdequacyLevel = adequacyLevel;
            Discription = discription;
            Status = status;
            
        }

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

        public static QuestionnairePlayerModule Create(Guid id, Guid userid, int age, bool acceptRule, bool playing, bool license, int building, int adequacy, string discription, string status = "Pending")
        {
            if (age < 13) throw new ArgumentException("Иди нахуй школьник, тебя тут не ждут. Делай уроки чем играть майнкрафт!");
            if (string.IsNullOrEmpty(discription)) throw new ArgumentException("Description cannot be null");

            return new QuestionnairePlayerModule(id, userid, age, acceptRule, playing, license, building, adequacy, discription, status);

        }


    }
}
