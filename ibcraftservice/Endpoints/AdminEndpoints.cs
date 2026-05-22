using System.Security.Claims;
using Ibcraft.Application.Abstracts.Auth;
using Ibcraft.Application.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ibcraft.API.Endpoints;

public static class AdminEndpoints
{
    public const string AdminRole = "Admin";
    private const string AccessTokenCookieName = "ACCESS_TOKEN";

    public static IEndpointRouteBuilder MapAdminEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("/admin/");

        group.MapPost("login", Login);
        group.MapPost("logout", Logout);
        group.MapGet("me", Me).RequireAuthorization("AdminOnly");

        return builder;
    }

    private static async Task<IResult> Login(
        [FromBody] AdminLoginRequest request,
        [FromServices] UserManager<UserEntity> userManager,
        [FromServices] IAuthProvider authProvider)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user is null || !await userManager.CheckPasswordAsync(user, request.Password))
        {
            return Results.Unauthorized();
        }

        if (!await userManager.IsInRoleAsync(user, AdminRole))
        {
            return Results.Forbid();
        }

        var roles = await userManager.GetRolesAsync(user);
        var (jwtToken, expiresAtUtc) = authProvider.GenerateToken(user, roles);
        authProvider.WriteAuthTokenAsHttpOnlyCookie(AccessTokenCookieName, jwtToken, expiresAtUtc);

        return Results.Ok(new
        {
            id = user.Id,
            email = user.Email,
            name = user.Nikname ?? user.UserName ?? user.Email,
            roles
        });
    }

    private static async Task<IResult> Me(
        HttpContext context,
        [FromServices] UserManager<UserEntity> userManager)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Results.Unauthorized();
        }

        var user = await userManager.FindByIdAsync(userId);

        if (user is null)
        {
            return Results.NotFound();
        }

        var roles = await userManager.GetRolesAsync(user);

        return Results.Ok(new
        {
            id = user.Id,
            email = user.Email,
            name = user.Nikname ?? user.UserName ?? user.Email,
            roles
        });
    }

    private static IResult Logout(HttpContext context)
    {
        context.Response.Cookies.Delete(AccessTokenCookieName);
        return Results.Ok();
    }

    private record AdminLoginRequest(string Email, string Password);
}
