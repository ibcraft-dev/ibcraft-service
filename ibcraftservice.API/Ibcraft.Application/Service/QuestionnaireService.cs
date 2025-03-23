

using Ibcraft.Application.Interfaces.Auth;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Core.Module;
using System.Security.Authentication;

namespace Ibcraft.Application.Service
{
    public class QuestionnaireService
    {
        private readonly IQuestionnaireRepository _questionnaireRepository;
        private readonly IUserRepository _userRepository;
        private readonly IAuthProvider _provider;

        public QuestionnaireService(IQuestionnaireRepository questionnaireRepository, IUserRepository userRepository, IAuthProvider provider) {
            _questionnaireRepository = questionnaireRepository;
            _userRepository = userRepository;
            _provider = provider;
        }

        public async Task AddQuestionnaire(int Age, string PlayingTime, bool AcceptRule, bool Playing, bool License, int Building, int Adequacy, string Discription, string token)
        {
            var userId = _provider.GetIdFromToken(token);

            if(userId != Guid.Empty)
            {
                var user = await _userRepository.GetById(userId);

                var quest =  await _questionnaireRepository.GetOneQuestionnaire(user.Id);

                if(quest != null)
                {
                    throw new Exception("Вы уже подали заявку!");
                }

                var model = QuestionnairePlayerModule.Create(
                        Guid.NewGuid(),
                        user.Id,
                        Age,
                        PlayingTime,
                        AcceptRule,
                        Playing,
                        License,
                        Building,
                        Adequacy,
                        Discription
                    );
                await _questionnaireRepository.Add(model);
                return;
            }

            throw new AuthenticationException();
            
        }

        public async Task<QuestionnairePlayerModule?> GetQuestionnaire(Guid id) {
            var data = await _questionnaireRepository.GetOneQuestionnaire(id);
            return data ?? null;
        }

        public async Task<List<QuestionnairePlayerModule>> GetAllQuestionnaire()
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
