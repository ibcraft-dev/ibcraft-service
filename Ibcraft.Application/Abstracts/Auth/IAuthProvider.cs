using Ibcraft.Application.Entity;


namespace Ibcraft.Application.Abstracts.Auth
{
    public interface IAuthProvider
    {
        (string jwtToken, DateTime expiresAtUtc) GenerateToken(UserEntity userEntity);
        string GenerateRefreshToken();
        void WriteAuthTokenAsHttpOnlyCookie(string cookieName, string token, DateTime expiration);
    }
}