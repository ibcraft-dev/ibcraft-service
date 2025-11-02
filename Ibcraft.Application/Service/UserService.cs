
using Ibcraft.Application.Interfaces.Auth;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Core.Module;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Ibcraft.Application.Service
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IAuthProvider _authProvider;
        private readonly IEmailProvider _emailProvider;
        private readonly string _clientAddress;

        public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IAuthProvider authProvider, IEmailProvider emailProvider, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _authProvider = authProvider;
            _emailProvider = emailProvider;
            _clientAddress = configuration["Clientaddress"] ?? "http://localhost:3000";
        }

        public async Task<bool> Confirm(string email, string token)
        {
            var result = await _userRepository.ConfirmEmailAsync(email, token);
            return result;
        }

        public async Task<bool> Forgot(string email)
        {
            var (result, token) = await _userRepository.ForgotPasword(email);
            if (result)
            {
                var confirmationLink = $"{_clientAddress}/auth/resetpassword?email={email}&token={token}";
                await _emailProvider.SendEmailAsync(email, "Смена пароля", $"Перейдите по ссылке, чтобы сменить пароль: {confirmationLink}");
            }
            return result;
        }

        public async Task<bool> Reset(string password, string token)
        {
            if (string.IsNullOrEmpty(password) || password.Length < UserModule.DEFAULT_LENGTH_PASSWORD) throw new ArgumentException("The password is too short!");

            var passwordHash = _passwordHasher.Generate(password);
            var result = await _userRepository.ResetPassword(passwordHash, token);
            return result;
        }

        public async Task<bool> ResetTokenVaild(string email, string token)
        {
            var result = await _userRepository.IsResetTokenValid(email, token);
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

            var confirmationLink = $"{_clientAddress}/auth/confirm-email?email={user.Email}&token={user.EmailConfirmedToken}";
            await _emailProvider.SendEmailAsync(user.Email, "Подтверждение email", $"Перейдите по ссылке: {confirmationLink}");

            await _userRepository.Add(user);
        }

        public async Task<(string, string)> Login(string email, string password)
        {
            var user = await _userRepository.GetByEmail(email);
            string errorMessage = string.Empty;

            if (user == null)
            {
                errorMessage = "Failed to login!";
                return (string.Empty, errorMessage);
            }

            if (!user.IsEmailConfirmed)
            {
                errorMessage = "Email not confim!";
                return (string.Empty, errorMessage);
            }

            var result = _passwordHasher.Verify(password, user.Password);

            if (result == false)
            {
                errorMessage = "Failed to login";
                return (string.Empty, errorMessage);
            }
            var token = _authProvider.GenerateToken(user);

            return (token.ToString(), errorMessage);
        }

        public async Task<UserModule> GetUser(string token)
        {
            var iduser = _authProvider.GetIdFromToken(token);
            return await _userRepository.GetById(iduser);
        }

        public (bool, string) UserValidation(string token)
        {
            var (vaild, message) = _authProvider.ValidationToken(token);
            return (vaild, message);
        }

        public async Task<bool> UpdateUserAvatar(string token, IFormFile file, string path)
        {
            var IdUser = _authProvider.GetIdFromToken(token);
            var staticFolder = Path.Combine(path, "static/avatars");
            Directory.CreateDirectory(staticFolder);

            var fileName = $"{IdUser}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(staticFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var avatarUrl = $"/static/avatars/{fileName}";
            return await _userRepository.UpdateAvatarUrl(IdUser, avatarUrl);
        }

        public async Task<bool> UpdateUserNikname(string token, string name)
        {
            var IdUser = _authProvider.GetIdFromToken(token);
            return await _userRepository.UpdateNikname(IdUser, name);
        }

        public async Task DeleteUser(string token)
        {
            var IdUser = _authProvider.GetIdFromToken(token);
            await _userRepository.DeleteUser(IdUser);
        }
    }

}
