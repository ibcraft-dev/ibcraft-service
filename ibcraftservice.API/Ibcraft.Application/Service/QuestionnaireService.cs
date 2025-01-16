

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

        public async Task AddQuestionnaire(int Age, bool AcceptRule, bool Playing, bool License, int Building, int Adequacy, string Discription, string token)
        {

            var userEmail = _provider.GetEmailFromToken(token);
            if(!string.IsNullOrEmpty(userEmail))
            {
                var user = await _userRepository.GetByEmail(userEmail);
                var model = QuestionnairePlayerModule.Create(
                        Guid.NewGuid(),
                        user.Id,
                        Age,
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
    }
}
