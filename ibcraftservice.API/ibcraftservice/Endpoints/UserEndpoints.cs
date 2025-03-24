
using Ibcraft.Application.Service;
using Ibcraft.Core.Enums;
using ibcraftservice.Contracts.User;
using ibcraftservice.Extensions;
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

            builder.MapPut("reset", ResetPassword);

            builder.MapPost("reset-token", CheckResetToken);

            builder.MapPut("update-avatar", UploadAvatar)
                .RequireAuthorization();

            builder.MapPut("confirm-email", ConfirmEmail);

            builder.MapGet("get-me", GetUser).RequireAuthorization()
                .WithMetadata(new EnableCorsAttribute("AllowSpecificOrigin"));

            builder.MapGet("chack-token", CheckToken).RequireAuthorization()
                .WithMetadata(new EnableCorsAttribute("AllowSpecificOrigin"));

            builder.MapPut("nikname-update", NiknameUpdate).RequireAuthorization();
            builder.MapDelete("delete-user", DeleteUser).RequireAuthorization().RequirePermissions(Permission.Delete);

            return builder;
        }

        private static async Task<IResult> DeleteUser(HttpContext context, UserService user)
        {
            var token = context.Request.Cookies["dragonkey"];
            if (token == null)
            {
                return Results.Unauthorized();
            }

            await user.DeleteUser(token);
            return Results.Ok();
        }

        private static async Task<IResult> NiknameUpdate([FromBody] UpdateNikname updateNikname, UserService user, HttpContext context)
        {
            var token = context.Request.Cookies["dragonkey"];
            if (token == null) {
                return Results.Unauthorized();
            }

            await user.UpdateUserNikname(token, updateNikname.newNikname);
            return Results.Ok("Никнейм обновлен успешно");
        }

        private static async Task<IResult> UploadAvatar(UserService user, HttpContext context, IWebHostEnvironment webHost)
        {
            var file = context.Request.Form.Files["file"];

            if (file == null || file.Length == 0) {
                return Results.BadRequest("File not upload");
            }

            var token = context.Request.Cookies["dragonkey"];
            if (token == null) {
                return Results.Unauthorized();
            }

            var result = await user.UpdateUserAvatar(token, file, webHost.ContentRootPath);
            if (!result)
            {
                return Results.BadRequest("Не удалось обновить аватар.");
            }

            return Results.Ok("Аватар обновлен успешно");
        }

        private static async Task<IResult> CheckResetToken([FromBody] ResetToken resetToken, UserService user)
        {
            var vaild = await user.ResetTokenVaild(resetToken.email, resetToken.token);
            return Results.Ok(vaild);
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

        private static async Task<IResult> ConfirmEmail([FromBody] ConfirmEmailRequest emailRequest, UserService user)
        {
            var result = await user.Confirm(emailRequest.Email, emailRequest.Token);
            if (result)
                return Results.Ok("Email подвержден!");
            return Results.BadRequest("Ошибка подтверждения");
        }

        private static async Task<IResult> Login([FromBody] LoginUserRequest request, UserService user, HttpContext context)
        {
            var (token, error) = await user.Login(request.Email, request.Password);

            if (!string.IsNullOrEmpty(error))
            {
                return Results.BadRequest(error);
            }

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
