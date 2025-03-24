using Ibcraft.Core.Enums;

namespace Ibcraft.Application.Interfaces.Service
{
    public interface IPermissionService
    {
        Task<HashSet<Permission>> GetPermissions(Guid userId);
    }
}