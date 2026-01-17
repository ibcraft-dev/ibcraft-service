using Ibcraft.Application.Entity;
using Ibcraft.Core.Module;

namespace Ibcraft.Application.Interfaces.Repositories
{
    public interface IQuestionnaireRepository
    {
        Task Add(QuestionnairePlayerEntity entity);
        Task<List<QuestionnairePlayerEntity>> GetAll();
        Task<QuestionnairePlayerEntity> GetOneUserQuestionnaire(Guid userId);
        Task<string> ApproveQuestionnaire(Guid id);
        Task<string> RejectQuestionnaire(Guid id);
        Task DeleteQuestionnaire(Guid id);
    }
}