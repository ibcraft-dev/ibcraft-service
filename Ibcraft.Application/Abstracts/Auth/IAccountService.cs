
using Ibcraft.Core.Requests;

namespace Ibcraft.Application.Abstracts.Auth;

public interface IAccountService
{
    Task RegisterAsync(RegisterRequest registerRequest);
    Task LoginAsync(LoginRequest loginRequest);
    Task RefreshTokenAsync(string? refreshToken);
}
    