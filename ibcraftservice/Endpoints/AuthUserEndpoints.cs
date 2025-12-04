

using Ibcraft.Application.Service;
using Ibcraft.Core.Module;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ibcraftservice.Endpoints;

public static class AuthUserEndpoints
{
    public static IEndpointRouteBuilder MapAuthUserEndpoints(this IEndpointRouteBuilder builder)
    {
        builder.MapGet("account/login/google", authAccountGoogle);
        builder.MapGet("account/login/google/callback", callbackGoogle).WithName("GoogleLoginCallback");
        return builder;
    }

    private static async Task<IResult> authAccountGoogle([FromQuery] string returnUrl, LinkGenerator linkGenerator, SignInManager<UserModule> signIn, HttpContext httpContext)
    {
        var properties = signIn.ConfigureExternalAuthenticationProperties("Google",
         linkGenerator.GetPathByName(httpContext, "GoogleLoginCallback" + $"?returnUrl={returnUrl}"));
        
        return Results.Challenge(properties, ["Google"]);
    }

    private static async Task<IResult> callbackGoogle([FromQuery] string returnUrl, HttpContext context, UserService accountService)
    {
       var result = await context.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

        if (!result.Succeeded)
        {
            return Results.Unauthorized();
        }

        await accountService.LoginWithGoogleAsync(result.Principal);

        return Results.Redirect(returnUrl);

    }


}
