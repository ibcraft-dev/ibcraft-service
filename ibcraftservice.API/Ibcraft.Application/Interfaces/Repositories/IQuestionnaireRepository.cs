using Ibcraft.Core.Module;

namespace Ibcraft.Application.Interfaces.Repositories
{
    public interface IQuestionnaireRepository
    {
        Task Add(QuestionnairePlayerModule playerEntity);
        Task<List<QuestionnairePlayerModule>> GetAll();
        Task<QuestionnairePlayerModule> GetOneQuestionnaire(Guid id);
        Task<QuestionnairePlayerModule> GetUserOneQuestionnaire(Guid userid);
        Task<string> ApproveQuestionnaire(Guid id);
        Task<string> RejectQuestionnaire(Guid id);
        Task DeleteQuestionnaire(Guid id);
    }
}