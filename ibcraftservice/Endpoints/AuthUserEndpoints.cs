
using Ibcraft.Application.Abstracts.Auth;
using Ibcraft.Application.Entity;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Core.Requests;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ibcraft.API.Endpoints;

public static class AuthUserEndpoints
{
    public static IEndpointRouteBuilder MapAuthUserEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("/auth/");

        group.MapPost("register", Register);
        group.MapPost("login", Login);
        group.MapPost("logout", Logout);
        group.MapGet("get-me", GetMe).RequireAuthorization();
        group.MapPut("nikname-update", UpdateNikname).RequireAuthorization();
        group.MapPut("update-avatar", UpdateAvatar).RequireAuthorization().DisableAntiforgery();
        group.MapPost("refresh", ResetRefreshToken);
        group.MapDelete("delete-user", DeleteUser).RequireAuthorization();
        group.MapGet("/google", authAccountGoogle);
        group.MapGet("/google/callback", callbackGoogle).WithName("GoogleLoginCallback");

        return builder;
    }

    private static async Task<IResult> authAccountGoogle(
    [FromQuery] string returnUrl,
    [FromServices] LinkGenerator linkGenerator,
    HttpContext httpContext)
    {
        
        var props = new AuthenticationProperties
        {
            RedirectUri = $"/api/auth/google/callback?returnUrl={returnUrl}"
        };

        return Results.Challenge(props, new[] { "Google" });
    }

    private static async Task<IResult> callbackGoogle( 
        [FromQuery] string returnUrl,
        HttpContext context,
        IAccountService accountService)
    {
        var result = await context.AuthenticateAsync("External");

        if (!result.Succeeded || result.Principal == null)
        {
           return Results.Redirect("/login?error=external_login_failed");
        }

        await accountService.LoginWithGoogleAsync(result.Principal);

        return Results.Redirect(returnUrl);
    }

     private static async Task<IResult> DeleteUser()
        {
            return Results.Ok();
        }


        private static IResult Logout(HttpContext context)
        {
            context.Response.Cookies.Delete("ACCESS_TOKEN");
            return Results.Ok();
        }

        private static async Task<IResult> GetMe(
            HttpContext context,
            [FromServices] UserManager<UserEntity> userManager)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var user = await userManager.FindByIdAsync(userId);

            if (user is null)
            {
                return Results.NotFound();
            }

            return Results.Ok(new
            {
                id = user.Id,
                name = user.Nikname ?? user.UserName ?? user.Email,
                avatarIco = user.UserAvatar
            });
        }

        private static async Task<IResult> UpdateNikname(
            [FromBody] UpdateNiknameRequest request,
            HttpContext context,
            [FromServices] IUserRepository userRepository)
        {
            var userId = GetCurrentUserId(context);

            if (userId is null)
            {
                return Results.Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(request.NewNikname))
            {
                return Results.BadRequest("Nikname cannot be empty.");
            }

            await userRepository.UpdateNikname(userId.Value, request.NewNikname.Trim());

            return Results.Ok();
        }

        private static async Task<IResult> UpdateAvatar(
            IFormFile file,
            HttpContext context,
            [FromServices] IUserRepository userRepository,
            [FromServices] IWebHostEnvironment environment)
        {
            var userId = GetCurrentUserId(context);

            if (userId is null)
            {
                return Results.Unauthorized();
            }

            if (file.Length == 0)
            {
                return Results.BadRequest("File cannot be empty.");
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowedExtensions = new HashSet<string> { ".jpg", ".jpeg", ".png", ".webp", ".gif" };

            if (!allowedExtensions.Contains(extension))
            {
                return Results.BadRequest("Unsupported image format.");
            }

            var avatarsPath = Path.Combine(environment.ContentRootPath, "static", "avatars");
            Directory.CreateDirectory(avatarsPath);

            var fileName = $"{userId.Value:N}-{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(avatarsPath, fileName);

            await using (var stream = File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            var avatarUrl = $"/static/avatars/{fileName}";
            await userRepository.UpdateAvatarUrl(userId.Value, avatarUrl);

            return Results.Ok(new { avatarIco = avatarUrl });
        }

        private static Guid? GetCurrentUserId(HttpContext context)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Guid.TryParse(userId, out var parsedUserId) ? parsedUserId : null;
        }


        private static async Task<IResult> Login([FromBody] LoginRequest request, IAccountService accountService)
        {
            await accountService.LoginAsync(request);
            return Results.Ok();
        }

        private static async Task<IResult> Register([FromBody] RegisterRequest request, IAccountService accountService)
        {
            await accountService.RegisterAsync(request);
            return Results.Ok();
        }

        private static async Task<IResult> ResetRefreshToken(HttpContext context, IAccountService accountService)
        {
            var refreshToken = context.Request.Cookies["REFRESH_TOKEN"];
            await accountService.RefreshTokenAsync(refreshToken);
            return Results.Ok();
        }

        private record UpdateNiknameRequest(string NewNikname);

}
