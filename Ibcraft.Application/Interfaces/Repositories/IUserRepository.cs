using Ibcraft.Core.Module;

namespace Ibcraft.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<bool> Add(UserModule user);
        Task<UserModule> GetByEmail(string email);
        Task<bool> ConfirmEmailAsync(string email, string token);
        Task<List<UserModule>> GetAll();
        Task<bool> UpdateNikname(Guid id, string nikname);
        Task UpdatePassword(Guid id, string passwordHeash);
        Task<(bool, string)> ForgotPasword(string email);
        Task<bool> ResetPassword(string newPasswordHash, string token);
        Task<UserModule> GetById(Guid Id);
        Task<bool> IsResetTokenValid(string email, string token);
        Task<bool> UpdateAvatarUrl(Guid UserId, string url);
        Task DeleteUser(Guid id);
    }
}