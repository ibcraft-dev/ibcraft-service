using System.Security.Claims;
using Ibcraft.Application.Abstracts.Auth;
using Ibcraft.Application.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ibcraft.API.Endpoints;

public static class AdminEndpoints
{
    public const string AdminRole = "Admin";
    public const string ModeratorRole = "Moderator";
    private const string AccessTokenCookieName = "ACCESS_TOKEN";

    public static IEndpointRouteBuilder MapAdminEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("/admin/");

        group.MapPost("login", Login);
        group.MapPost("logout", Logout);
        group.MapGet("me", Me).RequireAuthorization("AdminOnly");
        group.MapGet("users", Users).RequireAuthorization("AdminOnly");
        group.MapPut("users/{id:guid}", UpdateUser).RequireAuthorization("AdminOnly");
        group.MapPatch("users/{id:guid}/password", UpdateUserPassword).RequireAuthorization("AdminOnly");
        group.MapPatch("users/{id:guid}/ban", ToggleUserBan).RequireAuthorization("AdminOnly");
        group.MapDelete("users/{id:guid}", DeleteUser).RequireAuthorization("AdminOnly");

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

        if (!await userManager.IsInRoleAsync(user, AdminRole) &&
            !await userManager.IsInRoleAsync(user, ModeratorRole))
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
        DeleteAuthCookies(context);
        return Results.Ok();
    }

    private static void DeleteAuthCookies(HttpContext context)
    {
        var isHttps = context.Request.IsHttps;
        var options = new CookieOptions
        {
            Secure = isHttps,
            SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax
        };

        foreach (var cookieName in new[] { AccessTokenCookieName, "REFRESH_TOKEN" })
        {
            foreach (var path in new[] { "/", "/api/auth", "/api/admin" })
            {
                context.Response.Cookies.Delete(cookieName, new CookieOptions
                {
                    Path = path,
                    Secure = options.Secure,
                    SameSite = options.SameSite
                });
            }
        }
    }

    private static async Task<IResult> Users(
        [FromQuery] string? search,
        [FromServices] UserManager<UserEntity> userManager)
    {
        var query = userManager.Users.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim().ToLower();
            query = query.Where(user =>
                (user.Nikname != null && user.Nikname.ToLower().Contains(normalizedSearch)) ||
                (user.Email != null && user.Email.ToLower().Contains(normalizedSearch)));
        }

        var users = await query
            .OrderBy(user => user.Nikname ?? user.UserName ?? user.Email)
            .Take(80)
            .ToListAsync();

        var response = new List<object>(users.Count);

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            response.Add(ToAdminUserResponse(user, roles));
        }

        return Results.Ok(response);
    }

    private static async Task<IResult> UpdateUser(
        Guid id,
        [FromBody] AdminUpdateUserRequest request,
        [FromServices] UserManager<UserEntity> userManager,
        [FromServices] RoleManager<IdentityRole<Guid>> roleManager)
    {
        var user = await userManager.FindByIdAsync(id.ToString());

        if (user is null)
        {
            return Results.NotFound();
        }

        var nickname = request.Nickname?.Trim();
        if (string.IsNullOrWhiteSpace(nickname) || nickname.Length > UserEntityFactory.MAX_NIKNAME_LENGTH)
        {
            return Results.BadRequest(new { message = "Nickname must be between 1 and 60 characters." });
        }

        var email = request.Email?.Trim();
        if (string.IsNullOrWhiteSpace(email))
        {
            return Results.BadRequest(new { message = "Email is required." });
        }

        user.Nikname = nickname;

        if (!string.Equals(user.Email, email, StringComparison.OrdinalIgnoreCase))
        {
            var setEmailResult = await userManager.SetEmailAsync(user, email);
            if (!setEmailResult.Succeeded)
            {
                return Results.BadRequest(new { errors = setEmailResult.Errors.Select(error => error.Description) });
            }

            var setUserNameResult = await userManager.SetUserNameAsync(user, email);
            if (!setUserNameResult.Succeeded)
            {
                return Results.BadRequest(new { errors = setUserNameResult.Errors.Select(error => error.Description) });
            }
        }

        user.EmailConfirmed = request.EmailConfirmed;

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return Results.BadRequest(new { errors = updateResult.Errors.Select(error => error.Description) });
        }

        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            var role = request.Role.Trim();

            if (!await roleManager.RoleExistsAsync(role))
            {
                var createRoleResult = await roleManager.CreateAsync(new IdentityRole<Guid>(role));
                if (!createRoleResult.Succeeded)
                {
                    return Results.BadRequest(new { errors = createRoleResult.Errors.Select(error => error.Description) });
                }
            }

            var currentRoles = await userManager.GetRolesAsync(user);
            var removeRolesResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeRolesResult.Succeeded)
            {
                return Results.BadRequest(new { errors = removeRolesResult.Errors.Select(error => error.Description) });
            }

            var addRoleResult = await userManager.AddToRoleAsync(user, role);
            if (!addRoleResult.Succeeded)
            {
                return Results.BadRequest(new { errors = addRoleResult.Errors.Select(error => error.Description) });
            }
        }

        var roles = await userManager.GetRolesAsync(user);
        return Results.Ok(ToAdminUserResponse(user, roles));
    }

    private static async Task<IResult> UpdateUserPassword(
        Guid id,
        [FromBody] AdminUpdatePasswordRequest request,
        [FromServices] UserManager<UserEntity> userManager)
    {
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password != request.ConfirmPassword)
        {
            return Results.BadRequest(new { message = "Passwords must match." });
        }

        var user = await userManager.FindByIdAsync(id.ToString());

        if (user is null)
        {
            return Results.NotFound();
        }

        var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var resetResult = await userManager.ResetPasswordAsync(user, resetToken, request.Password);

        if (!resetResult.Succeeded)
        {
            return Results.BadRequest(new { errors = resetResult.Errors.Select(error => error.Description) });
        }

        return Results.Ok();
    }

    private static async Task<IResult> ToggleUserBan(
        Guid id,
        [FromBody] AdminBanUserRequest request,
        [FromServices] UserManager<UserEntity> userManager)
    {
        var user = await userManager.FindByIdAsync(id.ToString());

        if (user is null)
        {
            return Results.NotFound();
        }

        if (await userManager.IsInRoleAsync(user, AdminRole))
        {
            return Results.BadRequest(new { message = "Admin users cannot be banned." });
        }

        user.LockoutEnabled = true;
        user.LockoutEnd = request.IsBanned ? DateTimeOffset.MaxValue : null;

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return Results.BadRequest(new { errors = updateResult.Errors.Select(error => error.Description) });
        }

        var roles = await userManager.GetRolesAsync(user);
        return Results.Ok(ToAdminUserResponse(user, roles));
    }

    private static async Task<IResult> DeleteUser(
        Guid id,
        [FromServices] UserManager<UserEntity> userManager)
    {
        var user = await userManager.FindByIdAsync(id.ToString());

        if (user is null)
        {
            return Results.NotFound();
        }

        if (await userManager.IsInRoleAsync(user, AdminRole))
        {
            return Results.BadRequest(new { message = "Admin users cannot be deleted." });
        }

        var deleteResult = await userManager.DeleteAsync(user);
        if (!deleteResult.Succeeded)
        {
            return Results.BadRequest(new { errors = deleteResult.Errors.Select(error => error.Description) });
        }

        return Results.Ok();
    }

    private static object ToAdminUserResponse(UserEntity user, IList<string> roles)
    {
        var isBanned = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow;

        return new
        {
            id = user.Id,
            username = user.Nikname ?? user.UserName ?? user.Email ?? "Без ника",
            email = user.Email ?? string.Empty,
            createdAt = user.Created_at,
            emailVerified = user.EmailConfirmed,
            role = roles.FirstOrDefault() ?? "User",
            roles,
            isBanned
        };
    }

    private record AdminLoginRequest(string Email, string Password);
    private record AdminUpdateUserRequest(string Nickname, string Email, bool EmailConfirmed, string Role);
    private record AdminUpdatePasswordRequest(string Password, string ConfirmPassword);
    private record AdminBanUserRequest(bool IsBanned);
}
