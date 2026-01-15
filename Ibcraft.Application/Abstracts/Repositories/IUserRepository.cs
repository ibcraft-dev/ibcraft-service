using Ibcraft.Application.Entity;
using Ibcraft.Core.Module;

namespace Ibcraft.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<bool> Add(UserModule user);
        Task<UserEntity> GetByNikname(string nikname);
        Task<bool> UpdateNikname(Guid id, string nikname);
        Task<bool> UpdateAvatarUrl(Guid UserId, string url);
        Task<UserEntity?> GetUserByRefreshTokenAsync(string refreshToken);
        Task DeleteUser(Guid id);
    }
}