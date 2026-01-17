

using Ibcraft.Application.Abstracts;
using Ibcraft.Application.Entity;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Core.Exceptions;
using ibcraftservice.Core.Quesionnaire;

namespace Ibcraft.Application.Service
{


    public class QuestionnaireService : IQuestionnaireService
    {
        private readonly IQuestionnaireRepository _questionnaireRepository;

        private readonly ICurrentUser _currentUser;


        public QuestionnaireService(
        IQuestionnaireRepository questionnaireRepository,
        ICurrentUser currentUser
        )
        {
            _questionnaireRepository = questionnaireRepository;
            _currentUser = currentUser;
        }
        public async Task AddQuestionnaire(QuesionnaireRequest request)
        {
            if (!_currentUser.isAuthenticated)
                throw new UnauthorizedAccessException();

            var quest = await _questionnaireRepository.GetOneUserQuestionnaire(_currentUser.UserId);

            if (quest != null)
                throw new QuestionnaireExistsExpression("The questionnaire exists!");

            var questionnaire = QuestionnairePlayerEntityFactory.Create(
                userid: _currentUser.UserId,
                age: request.Age,
                playingTime: request.PlayingTime,
                acceptRule: request.AcceptRule,
                playingServer: request.PlayingServer,
                licenseMinecraft: request.LicenseMinecraft,
                buildingLevel: request.BuildingLevel,
                adequacyLevel: request.AdequacyLevel,
                description: request.Description
            );

            await _questionnaireRepository.Add(questionnaire);
        }


        public async Task<QuestionnairePlayerEntity> GetUserQuestionnaire(Guid? userId)
        {
            var data = await _questionnaireRepository.GetOneUserQuestionnaire(userId ?? _currentUser.UserId);
            return data ?? null!;
        }

        public async Task<List<QuestionnairePlayerEntity>> GetAllQuestionnaire()
        {
            return await _questionnaireRepository.GetAll();
        }

        public async Task<string> Approve(Guid id)
        {
            return await _questionnaireRepository.ApproveQuestionnaire(id);
        }

        public async Task<string> Reject(Guid id)
        {
            return await _questionnaireRepository.RejectQuestionnaire(id);
        }

        public async Task Delete(Guid id)
        {
            await _questionnaireRepository.DeleteQuestionnaire(id);
        }
    }
}
