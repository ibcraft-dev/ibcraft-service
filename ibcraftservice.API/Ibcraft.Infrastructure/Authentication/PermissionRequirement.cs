
using Ibcraft.Core.Enums;
using Microsoft.AspNetCore.Authorization;

namespace Ibcraft.Infrastructure.Authentication
{
    public class PermissionRequirement(Permission[] permissions) : IAuthorizationRequirement
    {
        public Permission[] Permissions { get; set; } = permissions;

    }
}
