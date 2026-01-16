
using Ibcraft.Application.Entity;
using Ibcraft.Application.Abstracts.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Ibcraft.Infrastructure
{
    public class AuthProvider : IAuthProvider
    {
        private readonly AuthOption _authOption;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthProvider(IOptions<AuthOption> authOption, IHttpContextAccessor httpContextAccessor)
        {
            _authOption = authOption.Value;
            _httpContextAccessor = httpContextAccessor;
        }

        public (string jwtToken, DateTime expiresAtUtc) GenerateToken(UserEntity user)
        {
            var signingKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_authOption.SecretKey));

            var credentials = new SigningCredentials(
                signingKey,
                SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim(ClaimTypes.NameIdentifier, user.Nikname?.ToString() ?? "")
            };

            var expires = DateTime.UtcNow.AddMinutes(_authOption.ExpiresHours);

            var token = new JwtSecurityToken(
                issuer: _authOption.Issuer,
                audience: _authOption.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: credentials);

            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            return (jwtToken, expires);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public void WriteAuthTokenAsHttpOnlyCookie(string cookieName, string token, DateTime expiration)
        {
            if (_httpContextAccessor.HttpContext != null)
            {
                _httpContextAccessor.HttpContext.Response.Cookies.Append(cookieName,
                    token, new CookieOptions
                    {
                        HttpOnly = true,
                        Expires = expiration,
                        IsEssential = true,
                        Secure = true,
                        SameSite = SameSiteMode.Strict
                    });
            } else
            {
                throw new InvalidOperationException("HTTP context is not available.");
            }
        }


    }
}
