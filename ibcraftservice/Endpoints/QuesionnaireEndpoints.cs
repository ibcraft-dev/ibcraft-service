
using Ibcraft.Application.Abstracts;
using Ibcraft.Application.Entity;
using ibcraftservice.Core.Quesionnaire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ibcraft.API.Endpoints
{
    public static class QuesionnaireEndpoints
    {
        public static IEndpointRouteBuilder MapQuestionnaireEndpoints(this IEndpointRouteBuilder builder)
        {
            var endpoints = builder.MapGroup("/questionnaire/").RequireAuthorization();

            endpoints.MapPost("create", AddQuesionnaire);
            endpoints.MapGet("getall", GetAll).RequireAuthorization("AdminOnly");
            endpoints.MapGet("{id:guid}/status", Status);
            endpoints.MapGet("{id:guid}/view", GetView);
            endpoints.MapPut("{id:guid}/approved", ApprovedUpdate).RequireAuthorization("AdminOnly");
            endpoints.MapPut("{id:guid}/reject", RejectUpdate).RequireAuthorization("AdminOnly");
            endpoints.MapDelete("{id:guid}/delete", Delete).RequireAuthorization("AdminOnly");

            return builder;
        }

        private static async Task<IResult> AddQuesionnaire(
            [FromBody] QuesionnaireRequest request,
            IQuestionnaireService service,
            HttpContext context,
            UserManager<UserEntity> userManager)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = string.IsNullOrWhiteSpace(userId) ? null : await userManager.FindByIdAsync(userId);

            if (user is null)
            {
                return Results.Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(user.Nikname))
            {
                return Results.BadRequest("Введите Minecraft никнейм перед подачей заявки.");
            }

            await service.AddQuestionnaire(request);
            return Results.Ok();
        }

        private static async Task<IResult> GetView(
            [FromRoute] Guid id,
            IQuestionnaireService service,
            UserManager<UserEntity> userManager)
        {
            var data = await service.GetUserQuestionnaire(id);
            if (data == null) {
                return Results.Ok("Unfiled");
            }

            var user = await userManager.FindByIdAsync(data.UserId.ToString());

            var response = new QuesionnaireResponse(
                data.Id,
                data.UserId,
                user?.Nikname ?? user?.UserName ?? user?.Email,
                data.Age,
                data.PlayingTime,
                data.AcceptRule,
                data.PlayingServer,
                data.LicenseMinecraft,
                data.BuildingLevel,
                data.AdequacyLevel,
                data.Description,
                data.Status
            );
            return Results.Ok(response);
        }

        private static async Task<IResult> Status([FromRoute] Guid? id, IQuestionnaireService service)
        {
            var data = await service.GetUserQuestionnaire(id);
            if (data == null) {
                return Results.Ok("Unfiled");
            }

            return Results.Ok(data.Status);
        }

        private static async Task<IResult> Delete([FromRoute] Guid id, IQuestionnaireService service)
        {
            await service.Delete(id);
            return Results.Ok();
        }

        private static async Task<IResult> ApprovedUpdate([FromRoute] Guid id, IQuestionnaireService service)
        {
            string status = await service.Approve(id);
            return Results.Ok(status);
        }

        private static async Task<IResult> RejectUpdate([FromRoute] Guid id, IQuestionnaireService service)
        {
            string status = await service.Reject(id);
            return Results.Ok(status);
        }

        private static async Task<IResult> GetAll(
            HttpContext context,
            IQuestionnaireService service,
            UserManager<UserEntity> userManager)
        {
            Console.WriteLine("Log");
            var quer = await service.GetAllQuestionnaire();
            var userIds = quer.Select(q => q.UserId).ToHashSet();
            var users = await userManager.Users
                .Where(user => userIds.Contains(user.Id))
                .ToDictionaryAsync(user => user.Id, user => user.Nikname ?? user.UserName ?? user.Email);

            var response = quer.Select(q => new QuesionnaireResponse(
                q.Id, 
                q.UserId,
                users.GetValueOrDefault(q.UserId),
                q.Age, 
                q.PlayingTime, 
                q.AcceptRule, 
                q.PlayingServer, 
                q.LicenseMinecraft, 
                q.BuildingLevel, 
                q.AdequacyLevel, 
                q.Description, 
                q.Status));

            return Results.Ok(response);
        }



    }
}
