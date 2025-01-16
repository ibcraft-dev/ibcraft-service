using Ibcraft.Core.Module;
using System.Security.Claims;

namespace Ibcraft.Application.Interfaces.Auth
{
    public interface IAuthProvider
    {
        string GenerateToken(UserModule userModule);
        List<Claim> GetClaimsForUser(UserModule userModule);
    }
}