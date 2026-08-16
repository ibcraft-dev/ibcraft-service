
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

            var roles = await _userManager.GetRolesAsync(user);
            var (jwtToken, expiresAtUtc) = _authProvider.GenerateToken(user, roles);
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
            
            var roles = await _userManager.GetRolesAsync(user);
            var (jwtToken, expirationDateInUtc) = _authProvider.GenerateToken(user, roles);
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
            if (claimsPrincipal == null)
                throw new ExternalLoginProviderException("Google", "ClaimsPrincipal is null");

            var providerKey = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(providerKey))
                throw new ExternalLoginProviderException("Google", "NameIdentifier is null");

            var email = claimsPrincipal.FindFirstValue(ClaimTypes.Email);
            var displayName = claimsPrincipal.FindFirstValue(ClaimTypes.Name);

            await LoginWithExternalAsync("Google", providerKey, email, displayName, null);
        }

        public async Task LoginWithExternalAsync(
            string provider,
            string providerKey,
            string? email,
            string? displayName,
            string? avatarUrl)
        {
            if (string.IsNullOrWhiteSpace(provider))
                throw new ExternalLoginProviderException("External", "Provider is null");

            if (string.IsNullOrWhiteSpace(providerKey))
                throw new ExternalLoginProviderException(provider, "ProviderKey is null");

            var user = await _userManager.FindByLoginAsync(provider, providerKey);

            if (user == null)
            {
                var normalizedEmail = string.IsNullOrWhiteSpace(email)
                    ? $"{provider.ToLowerInvariant()}_{providerKey}@external.ibcraft.local"
                    : email.Trim();

                user = await _userManager.FindByEmailAsync(normalizedEmail);

                if (user == null)
                {
                    var userName = CreateExternalUserName(provider, providerKey);

                    user = new UserEntity
                    {
                        Nikname = null,
                        UserName = userName,
                        Email = normalizedEmail,
                        EmailConfirmed = true
                    };

                    if (!string.IsNullOrWhiteSpace(avatarUrl))
                    {
                        user.UserAvatar = avatarUrl;
                    }

                    var createResult = await _userManager.CreateAsync(user);

                    if (!createResult.Succeeded)
                    {
                        throw new ExternalLoginProviderException(
                            provider,
                            $"Unable to create user: {string.Join(", ",
                                createResult.Errors.Select(x => x.Description))}");
                    }
                }
                else if (string.IsNullOrWhiteSpace(user.UserAvatar) && !string.IsNullOrWhiteSpace(avatarUrl))
                {
                    user.UserAvatar = avatarUrl;
                    await _userManager.UpdateAsync(user);
                }

                var info = new UserLoginInfo(provider, providerKey, provider);

                var addLoginResult = await _userManager.AddLoginAsync(user, info);

                if (!addLoginResult.Succeeded)
                {
                    throw new ExternalLoginProviderException(
                        provider,
                        $"Unable to add external login: {string.Join(", ",
                            addLoginResult.Errors.Select(x => x.Description))}");
                }
            }
            var shouldUpdateUser = false;

            if (string.IsNullOrWhiteSpace(user.UserAvatar) && !string.IsNullOrWhiteSpace(avatarUrl))
            {
                user.UserAvatar = avatarUrl;
                shouldUpdateUser = true;
            }

            if (shouldUpdateUser)
            {
                await _userManager.UpdateAsync(user);
            }

            await SignInUserAsync(user);
        }

        private static string CreateExternalUserName(string provider, string providerKey)
        {
            var safeProvider = new string(provider.Where(char.IsLetterOrDigit).ToArray());
            var safeProviderKey = new string(providerKey.Where(char.IsLetterOrDigit).ToArray());
            var userName = $"{safeProvider}{safeProviderKey}";

            return userName.Length <= UserEntityFactory.MAX_NIKNAME_LENGTH
                ? userName
                : userName[..UserEntityFactory.MAX_NIKNAME_LENGTH];
        }
        
        private async Task SignInUserAsync(UserEntity user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var (jwtToken, expirationDateInUtc) = _authProvider.GenerateToken(user, roles);

            var refreshToken = _authProvider.GenerateRefreshToken();
            var refreshTokenExpirationDateInUtc = DateTime.UtcNow.AddDays(7);

            user.RefreshToken = refreshToken;
            user.TokenExpiration = refreshTokenExpirationDateInUtc;

            await _userManager.UpdateAsync(user);

            
            _authProvider.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", jwtToken, expirationDateInUtc);
            _authProvider.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", user.RefreshToken, refreshTokenExpirationDateInUtc);
        }
    }
}  
