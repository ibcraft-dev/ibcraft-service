using Ibcraft.Application.Entity;

namespace Ibcraft.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<UserEntity> GetByNikname(string nikname);
        Task<bool> UpdateNikname(Guid id, string nikname);
        Task<bool> UpdateAvatarUrl(Guid UserId, string url);
        Task<UserEntity?> GetUserByRefreshTokenAsync(string refreshToken);
        Task DeleteUser(Guid id);
    }
}