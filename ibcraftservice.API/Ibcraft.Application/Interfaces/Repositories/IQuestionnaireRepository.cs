using Ibcraft.Core.Module;

namespace Ibcraft.Application.Interfaces.Repositories
{
    public interface IQuestionnaireRepository
    {
        Task Add(QuestionnairePlayerModule playerEntity);
        Task<List<QuestionnairePlayerModule>> GetAll();
    }
}