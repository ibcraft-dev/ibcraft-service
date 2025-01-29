

using Ibcraft.Application.Service;
using ibcraftservice.Contracts.User;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace ibcraftservice.Endpoints
{
    public static class UserEndpoints
    {
        public static IEndpointRouteBuilder MapUsersEndpoints(this IEndpointRouteBuilder builder)
        {
            builder.MapPost("register", Register);

            builder.MapPost("login", Login);

            builder.MapPost("logout", Logout);

            builder.MapPost("forgot", ForgotPassword);

            builder.MapPost("reset", ResetPassword);

            builder.MapGet("confirm-email", ConfirmEmail);

            builder.MapGet("get-user", GetUser).RequireAuthorization()
                .WithMetadata(new EnableCorsAttribute("AllowSpecificOrigin"));

            builder.MapGet("chack-token", CheckToken).RequireAuthorization()
                .WithMetadata(new EnableCorsAttribute("AllowSpecificOrigin")); 

            return builder;
        }

        private static IResult CheckToken(HttpContext context, UserService user)
        {
            var token = context.Request.Cookies["dragonkey"];
            if (string.IsNullOrEmpty(token))
            {
                return Results.Unauthorized();
            }

            var (vaild, message) = user.UserValidation(token);

            if (vaild)
            {
                return Results.Ok(message);
            }

            context.Response.Cookies.Delete("dragonkey");
            return Results.BadRequest(message);

        }

        private static async Task<IResult> GetUser(HttpContext context, UserService user)
        {
            var token = context.Request.Cookies["dragonkey"];

            if (string.IsNullOrEmpty(token))
            {
                return Results.Unauthorized();
            }

            var userData = await user.GetUser(token);
            var response = new UserResponse(userData.Id, userData.Nikname, userData.Email, userData.UserAvatar);
            if (userData == null)
            {
               return Results.BadRequest("Null response");
            }

            return Results.Ok(response);
        }

        private static async Task<IResult> ResetPassword([FromBody] ResetPasswordRequest resetPassword, UserService user)
        {
            if (string.IsNullOrEmpty(resetPassword.Token))
            {
                return Results.BadRequest("Invaild token");
            }

            if(string.IsNullOrEmpty(resetPassword.NewPassword) || string.IsNullOrEmpty(resetPassword.ConfirmPassword)) { 
                return Results.BadRequest("Поля ввода не должны быть пустыми!");
            }

            if (resetPassword.NewPassword != resetPassword.ConfirmPassword)
            {
                return Results.BadRequest("Пароли не совпадают!");
            }
            

            var result = await user.Reset(resetPassword.NewPassword, resetPassword.Token);
            if (result)
                return Results.Ok("Ваш пароль успешно изменен!");

            return Results.BadRequest("Ой, шото пошло не так");
        }

        private static async Task<IResult> ForgotPassword([FromBody] PasswordRecoveryRequest recoveryRequest, UserService user)
        {
            var result = await user.Forgot(recoveryRequest.Email);
            if (result)
            {
                return Results.Ok("Запрос на смену пароля, был отправлен на вашу почту");
            }
                
            return Results.BadRequest("Запрос по смени пароля не был отпрален, профиль с таким email был не найден.");

        }

        private static IResult Logout(HttpContext context)
        {
            context.Response.Cookies.Delete("dragonkey");
            return Results.Ok();
        }

        private static async Task<IResult> ConfirmEmail(string email, string token, UserService user)
        {
            var result = await user.Confirm(email, token);
            if (result)
                return Results.Ok("Email подвержден!");
            return Results.BadRequest("Ошибка подтверждения");
        }

        private static async Task<IResult> Login([FromBody] LoginUserRequest request, UserService user, HttpContext context)
        {
            var token = await user.Login(request.Email, request.Password);
            var cookieOpt = new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(1)
            };

            context.Response.Cookies.Append("dragonkey", token, cookieOpt);
            return Results.Ok();
        }

        private static async Task<IResult> Register([FromBody] RegisterUserRequest request, UserService user)
        {
            if (request.Password != request.ConfirmPassword)
            {
                throw new ArgumentException("Passwords don't match!");
            }

            await user.Register(request.Nikname, request.Email, request.Password);
            return Results.Ok();
        }


    }
}
