using Ibcraft.Core.Module;

namespace Ibcraft.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task Add(UserModule user);
        Task<UserModule> GetByEmail(string email);
        Task<bool> ConfirmEmailAsync(string email, string token);
    }
}