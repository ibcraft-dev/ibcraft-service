
using System.Security.Claims;
using Ibcraft.Application.Abstracts.Auth;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Application.Entity;
using Microsoft.AspNetCore.Identity;
using Ibcraft.Core.Requests;
using Ibcraft.Core.Exceptions;

namespace Ibcraft.Application.Service
{
    public class AccountService : IAccountService
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IAuthProvider _authProvider;


        public AccountService(IUserRepository userRepository, IAuthProvider authProvider, UserManager<UserEntity> userManager)
        {
            _userRepository = userRepository;
            _authProvider = authProvider;
            _userManager = userManager;
        }


        public async Task RegisterAsync(RegisterRequest registerRequest)
        {
            var userNiknameExists = await _userRepository.GetByNikname(registerRequest.Nikname) != null;
            var userEmailExists = await _userManager.FindByEmailAsync(registerRequest.Email) != null;

            if (userNiknameExists)
                throw new UserAlreadyExistsExceptionNikname(registerRequest.Nikname);
            if (userEmailExists)
                throw new UserAlreadyExistsExceptionEmail(registerRequest.Email);

            var user = UserEntityFactory.Create(registerRequest.Nikname, registerRequest.Email);
            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, registerRequest.Password);
            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                 throw new RegistrationFailedException(result.Errors.Select(e => e.Description));
            }
        }

        public async Task LoginAsync(LoginRequest loginRequest)
        {
            var user = await _userRepository.GetByNikname(loginRequest.Nikname);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginRequest.Password))
            {
                throw new LoginFailedException(loginRequest.Nikname);
            }

            var (jwtToken, expiresAtUtc) = _authProvider.GenerateToken(user);
            var refreshToken = _authProvider.GenerateRefreshToken();

            var refreshTokenExpirationDateInUtc = DateTime.UtcNow.AddDays(7);

            user.RefreshToken = refreshToken;
            user.TokenExpiration = refreshTokenExpirationDateInUtc;

            await _userManager.UpdateAsync(user);

            _authProvider.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", jwtToken, expiresAtUtc);
            _authProvider.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", user.RefreshToken, refreshTokenExpirationDateInUtc);
        }

        public async Task RefreshTokenAsync(string? refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new RefreshTokenException("Refresh token is missing.");
            }

            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

            if (user == null)
            {
                throw new RefreshTokenException("Unable to retrieve user for refresh token");
            }

            if (user.TokenExpiration < DateTime.UtcNow)
            {
                throw new RefreshTokenException("Refresh token is expired.");
            }
            
            var (jwtToken, expirationDateInUtc) = _authProvider.GenerateToken(user);
            var refreshTokenValue = _authProvider.GenerateRefreshToken();

            var refreshTokenExpirationDateInUtc = DateTime.UtcNow.AddDays(7);

            user.RefreshToken = refreshTokenValue;
            user.TokenExpiration = refreshTokenExpirationDateInUtc;

            await _userManager.UpdateAsync(user);
            
            _authProvider.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", jwtToken, expirationDateInUtc);
            _authProvider.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", user.RefreshToken, refreshTokenExpirationDateInUtc);
        }

        public async Task LoginWithGoogleAsync(ClaimsPrincipal? claimsPrincipal)
        {
            
        }


    }

}
