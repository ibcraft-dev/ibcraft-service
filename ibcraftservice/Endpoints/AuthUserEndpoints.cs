

using Ibcraft.Application.Abstracts.Auth;
using Ibcraft.Application.Entity;
using Ibcraft.Application.Service;
using Ibcraft.Core.Requests;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ibcraft.API.Endpoints;

public static class AuthUserEndpoints
{
    public static IEndpointRouteBuilder MapAuthUserEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("/account/");

        group.MapPost("register", Register);
        group.MapPost("login", Login);
        group.MapPost("logout", Logout);
        group.MapPost("refresh", ResetRefreshToken);
        group.MapDelete("delete-user", DeleteUser).RequireAuthorization();
        group.MapGet("login/google", authAccountGoogle);
        group.MapGet("login/google/callback", callbackGoogle).WithName("GoogleLoginCallback");

        return builder;
    }

    private static async Task<IResult> authAccountGoogle(
    [FromQuery] string returnUrl,
    [FromServices] LinkGenerator linkGenerator,
    [FromServices] SignInManager<UserEntity> signIn, 
    HttpContext httpContext)
    {
        var properties = signIn.ConfigureExternalAuthenticationProperties("Google",
         linkGenerator.GetPathByName(httpContext, "GoogleLoginCallback" + $"?returnUrl={returnUrl}"));
        
        return Results.Challenge(properties, ["Google"]);
    }

    private static async Task<IResult> callbackGoogle( 
        [FromQuery] string returnUrl,
        HttpContext context,
        IAccountService accountService)
    {
        Console.WriteLine("ХУЙ!");
        var result = await context.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

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

}
