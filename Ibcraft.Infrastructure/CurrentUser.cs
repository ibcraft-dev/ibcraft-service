using System.Security.Claims;
using Ibcraft.Application.Abstracts;
using Microsoft.AspNetCore.Http;

namespace Ibcraft.Infrastructure;

public class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    public Guid UserId
    {
        get
        {
            var userId = _httpContextAccessor.HttpContext?
                .User
                .FindFirstValue(ClaimTypes.NameIdentifier);

            return userId is null ? throw new UnauthorizedAccessException() : Guid.Parse(userId);
        }
    }

    public bool isAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

}
