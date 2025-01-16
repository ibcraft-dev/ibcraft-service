
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
    }
}
