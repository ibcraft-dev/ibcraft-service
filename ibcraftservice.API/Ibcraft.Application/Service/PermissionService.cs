
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Application.Interfaces.Service;
using Ibcraft.Core.Enums;

namespace Ibcraft.Application.Service
{
    public class PermissionService : IPermissionService
    {
        private readonly IUserRepository _userRepository;

        public PermissionService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public Task<HashSet<Permission>> GetPermissions(Guid userId)
        {
            return _userRepository.GetUserPermissions(userId);
        }
    }
}
