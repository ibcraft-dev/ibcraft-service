
using Ibcraft.Application.Abstracts.Auth;
using Ibcraft.Application.Entity;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Core.Requests;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

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
        group.MapGet("/discord", authAccountDiscord);
        group.MapGet("/discord/callback", callbackDiscord).WithName("DiscordLoginCallback");
        group.MapGet("/telegram/callback", callbackTelegram).WithName("TelegramLoginCallback");

        return builder;
    }

    private static IResult authAccountGoogle([FromQuery] string returnUrl)
    {
        
        var props = new AuthenticationProperties
        {
            RedirectUri = $"/api/auth/google/callback?returnUrl={Uri.EscapeDataString(returnUrl)}"
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
        await context.SignOutAsync("External");

        return Results.Redirect(returnUrl);
    }

    private static IResult authAccountDiscord([FromQuery] string returnUrl)
    {
        var props = new AuthenticationProperties
        {
            RedirectUri = $"/api/auth/discord/callback?returnUrl={Uri.EscapeDataString(returnUrl)}"
        };

        return Results.Challenge(props, new[] { "Discord" });
    }

    private static async Task<IResult> callbackDiscord(
        [FromQuery] string returnUrl,
        HttpContext context,
        IAccountService accountService)
    {
        var result = await context.AuthenticateAsync("External");

        if (!result.Succeeded || result.Principal == null)
        {
            return Results.Redirect("/login?error=external_login_failed");
        }

        var providerKey = result.Principal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(providerKey))
        {
            return Results.Redirect("/login?error=external_login_failed");
        }

        var email = result.Principal.FindFirstValue(ClaimTypes.Email);
        var username = result.Principal.FindFirstValue(ClaimTypes.Name);
        var avatarHash = result.Principal.FindFirstValue("urn:discord:avatar");
        var avatarUrl = string.IsNullOrWhiteSpace(avatarHash)
            ? null
            : $"https://cdn.discordapp.com/avatars/{providerKey}/{avatarHash}.png";

        await accountService.LoginWithExternalAsync("Discord", providerKey, email, username, avatarUrl);
        await context.SignOutAsync("External");

        return Results.Redirect(returnUrl);
    }

    private static async Task<IResult> callbackTelegram(
        [FromQuery] string returnUrl,
        HttpContext context,
        IAccountService accountService,
        IConfiguration configuration)
    {
        var botToken = configuration["Authentication:Telegram:BotToken"];

        if (string.IsNullOrWhiteSpace(botToken))
        {
            return Results.Redirect("/login?error=telegram_not_configured");
        }

        var authData = context.Request.Query
            .Where(x => x.Key != "returnUrl")
            .ToDictionary(x => x.Key, x => x.Value.ToString());

        if (!IsValidTelegramAuthData(authData, botToken, configuration))
        {
            return Results.Redirect("/login?error=telegram_auth_failed");
        }

        var providerKey = authData["id"];
        var username = authData.GetValueOrDefault("username");
        var firstName = authData.GetValueOrDefault("first_name");
        var lastName = authData.GetValueOrDefault("last_name");
        var displayName = string.Join(" ", new[] { firstName, lastName }.Where(x => !string.IsNullOrWhiteSpace(x)));
        var avatarUrl = authData.GetValueOrDefault("photo_url");
        var email = $"telegram_{providerKey}@external.ibcraft.local";

        await accountService.LoginWithExternalAsync(
            "Telegram",
            providerKey,
            email,
            string.IsNullOrWhiteSpace(username) ? displayName : username,
            avatarUrl);

        return Results.Redirect(returnUrl);
    }

    private static bool IsValidTelegramAuthData(
        IReadOnlyDictionary<string, string> authData,
        string botToken,
        IConfiguration configuration)
    {
        if (!authData.TryGetValue("hash", out var receivedHash) ||
            string.IsNullOrWhiteSpace(receivedHash) ||
            !authData.TryGetValue("id", out var id) ||
            string.IsNullOrWhiteSpace(id) ||
            !authData.TryGetValue("auth_date", out var authDateValue) ||
            !long.TryParse(authDateValue, out var authDateUnix))
        {
            return false;
        }

        var maxAgeMinutes = configuration.GetValue("Authentication:Telegram:MaxAuthAgeMinutes", 1440);
        var authDate = DateTimeOffset.FromUnixTimeSeconds(authDateUnix);

        if (DateTimeOffset.UtcNow - authDate > TimeSpan.FromMinutes(maxAgeMinutes))
        {
            return false;
        }

        var dataCheckString = string.Join(
            "\n",
            authData
                .Where(x => x.Key != "hash")
                .OrderBy(x => x.Key, StringComparer.Ordinal)
                .Select(x => $"{x.Key}={x.Value}"));

        var secretKey = SHA256.HashData(Encoding.UTF8.GetBytes(botToken));
        using var hmac = new HMACSHA256(secretKey);
        var computedHash = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes(dataCheckString))).ToLowerInvariant();

        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(computedHash),
            Encoding.UTF8.GetBytes(receivedHash.ToLowerInvariant()));
    }

     private static IResult DeleteUser()
        {
            return Results.Ok();
        }


        private static IResult Logout(HttpContext context)
        {
            DeleteAuthCookies(context);
            return Results.Ok();
        }

        private static void DeleteAuthCookies(HttpContext context)
        {
            var isHttps = context.Request.IsHttps;
            var sameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax;

            foreach (var cookieName in new[] { "ACCESS_TOKEN", "REFRESH_TOKEN" })
            {
                foreach (var path in new[] { "/", "/api/auth", "/api/admin" })
                {
                    context.Response.Cookies.Delete(cookieName, new CookieOptions
                    {
                        Path = path,
                        Secure = isHttps,
                        SameSite = sameSite
                    });
                }
            }
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

            var roles = await userManager.GetRolesAsync(user);
            var isBanned = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow;

            return Results.Ok(new
            {
                id = user.Id,
                name = user.Nikname,
                avatarIco = user.UserAvatar,
                roles,
                isBanned,
                requiresNickname = string.IsNullOrWhiteSpace(user.Nikname)
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

            var nextNikname = request.NewNikname.Trim();

            if (nextNikname.Length > UserEntityFactory.MAX_NIKNAME_LENGTH)
            {
                return Results.BadRequest($"Nikname cannot be longer than {UserEntityFactory.MAX_NIKNAME_LENGTH} characters.");
            }

            if (!Regex.IsMatch(nextNikname, "^[A-Za-z0-9_]{3,16}$"))
            {
                return Results.BadRequest("Minecraft nickname can contain only latin letters, digits and underscore, from 3 to 16 characters.");
            }

            var existingUser = await userRepository.GetByNikname(nextNikname);
            if (existingUser is not null && existingUser.Id != userId.Value)
            {
                return Results.Conflict("Nikname is already taken.");
            }

            await userRepository.UpdateNikname(userId.Value, nextNikname);

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
