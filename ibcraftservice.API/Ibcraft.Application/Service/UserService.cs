
using Ibcraft.Application.Interfaces.Auth;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Core.Module;

namespace Ibcraft.Application.Service
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IAuthProvider _authProvider;
        private readonly IEmailProvider _emailProvider;

        public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IAuthProvider authProvider, IEmailProvider emailProvider)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _authProvider = authProvider;
            _emailProvider = emailProvider;
        }

        public async Task<bool> Confirm(string email, string token)
        {
            var result = await _userRepository.ConfirmEmailAsync(email, token);
            return result;
        }

        public async Task Register(string nikname, string email, string password)
        {
            if (string.IsNullOrEmpty(password) || password.Length < UserModule.DEFAULT_LENGTH_PASSWORD) throw new ArgumentException("The password is too short!");
            var checkMail = await _userRepository.GetByEmail(email);

            if (checkMail != null) throw new ArgumentException("this email already exists");
     

            var hashedPassword = _passwordHasher.Generate(password);

            var user = UserModule.Create(
                Guid.NewGuid(),
                nikname,
                email,
                hashedPassword);

            var confirmationLink = $"https://localhost:7157/confirm-email?email={user.Email}&token={user.EmailConfirmedToken}";
            await _emailProvider.SendEmailAsync(user.Email, "Подтверждение email", $"Перейдите по ссылке: {confirmationLink}");

            await _userRepository.Add(user);
        }


        public async Task<string> Login(string email, string password)
        {
            var user = await _userRepository.GetByEmail(email);

            if (user == null) {
                throw new Exception("Failed to login");
            }

            if (!user.IsEmailConfirmed)
            {
                throw new Exception("Email not confim!");
            }

            var result = _passwordHasher.Verify(password, user.Password);

            if (result == false)
            {
                throw new Exception("Failed to login");
            }
            var token = _authProvider.GenerateToken(user);

            return token.ToString();
        }

    }

}
