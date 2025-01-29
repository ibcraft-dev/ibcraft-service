
using Ibcraft.Application.Interfaces.Auth;
using Ibcraft.Core.Module;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Ibcraft.Infrastructure
{
    public class AuthProvider(IOptions<AuthOption> options) : IAuthProvider
    {
        private readonly AuthOption _options = options.Value;

        private SigningCredentials GetSigningCredentials()
        {
            var secret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey));
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        public List<Claim> GetClaimsForUser(UserModule userModule)
        {
            List<Claim> list = [
                    new Claim(ClaimTypes.Email, userModule.Email),
                    new Claim("UserId", userModule.Id.ToString())
                ];

            return list;
        }

        public string GenerateToken(UserModule userModule)
        {
            var token = new JwtSecurityToken(
                    issuer: _options.Issuer,
                    claims: GetClaimsForUser(userModule),
                    expires: DateTime.Now.AddHours(_options.ExpiresHours),
                    signingCredentials: GetSigningCredentials()
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GetEmailFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            if (handler.CanReadToken(token))
            {
                var result = handler.ReadJwtToken(token);
                return result.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            }
            return "";
        }

        public Guid GetIdFromToken(string token)
        {
            string id = string.Empty;
            var handler = new JwtSecurityTokenHandler();
            if (handler.CanReadToken(token))
            {
                var result = handler.ReadJwtToken(token);
                id = result.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            }

            if (Guid.TryParse(id, out Guid guid))
            {
                return guid;
            }
            else
            {
                return Guid.Empty;
            }
            
        }

        public (bool, string) ValidationToken(string token)
        {
            string messageError = string.Empty;
            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(token))
            {
                messageError = "Invalid token";
                return (false, messageError);
            }

            var jwtTokenData = handler.ReadJwtToken(token);
            var expClaim = jwtTokenData.Claims.FirstOrDefault(c => c.Type == "exp")?.Value;
            if (expClaim == null)
            {
                messageError = "Expiration claim is missing";
                return (false, messageError);
            }

            var expData = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expClaim)).UtcDateTime;
            var now = DateTime.UtcNow;

            if (expData < now)
            {
                messageError = "Token expired";
                return (false, messageError);
            }

            return (true, "Token is valid");

        }

    }
}
