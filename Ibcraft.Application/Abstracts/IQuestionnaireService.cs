using Ibcraft.Application.Entity;
using ibcraftservice.Core.Quesionnaire;

namespace Ibcraft.Application.Abstracts;

public interface IQuestionnaireService
{
        Task AddQuestionnaire(QuesionnaireRequest request);
        Task<string> Approve(Guid id);
        Task Delete(Guid id);
        Task<List<QuestionnairePlayerEntity>> GetAllQuestionnaire();
        Task<QuestionnairePlayerEntity> GetUserQuestionnaire(Guid? userId);
        Task<string> Reject(Guid id);
}
