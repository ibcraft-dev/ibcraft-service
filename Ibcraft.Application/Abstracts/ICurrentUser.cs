
namespace Ibcraft.Application.Abstracts;

public interface ICurrentUser
{
    Guid UserId { get; }
    bool isAuthenticated { get; }
}
