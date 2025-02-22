
using Ibcraft.Application.Service;
using ibcraftservice.Contracts.Quesionnaire;
using Microsoft.AspNetCore.Mvc;

namespace ibcraftservice.Endpoints
{
    public static class QuesionnaireEndpoints
    {
        public static IEndpointRouteBuilder MapQuestionnaireEndpoints(this IEndpointRouteBuilder builder)
        {
            var endpoints = builder.MapGroup("quesionnaire").RequireAuthorization();

            endpoints.MapPost("quest-post", AddQuesionnaire);
            endpoints.MapGet("quest-get", GetAll);
            endpoints.MapGet("{id:guid}/status", Status);
            endpoints.MapPut("{id:guid}/approved", ApprovedUpdate);
            endpoints.MapPut("{id:guid}/reject", RejectUpdate);
            endpoints.MapDelete("{id:guid}/delete", Delete);

            return builder;
        }

        private static async Task<IResult> Status([FromRoute] Guid id, QuestionnaireService service)
        {
            var data = await service.GetQuestionnaire(id);
            if (data == null) {
                return Results.Ok("Unfiled");
            }

            return Results.Ok(data.Status);
        }

        private static async Task<IResult> Delete([FromRoute] Guid id, QuestionnaireService service)
        {
            await service.Delete(id);
            return Results.Ok();
        }

        private static async Task<IResult> ApprovedUpdate([FromRoute] Guid id, QuestionnaireService service)
        {
            string status = await service.Approve(id);
            return Results.Ok(status);
        }

        private static async Task<IResult> RejectUpdate([FromRoute] Guid id, QuestionnaireService service)
        {
            string status = await service.Reject(id);
            return Results.Ok(status);
        }

        private static async Task<IResult> GetAll(QuestionnaireService service, HttpContext context)
        {
            var quer = await service.GetAllQuestionnaire();

            var response = quer.Select(q => new QuesionnaireResponse(q.Id, q.Age, q.PlayingTime, q.AcceptRule, q.PlayingServer, q.LicenseMinecraft, q.BuildingLevel, q.AdequacyLevel, q.Discription, q.Status));

            return Results.Ok(response);
        }

        private static async Task<IResult> AddQuesionnaire([FromBody] QuesionnaireRequest request, QuestionnaireService questionnaireService ,HttpContext context)
        {
            var token = context.Request.Cookies["dragonkey"];

            if (string.IsNullOrEmpty(token))
            {
                return Results.Unauthorized();
            }

            try {

            await questionnaireService.AddQuestionnaire(
                request.Age,
                request.playingTime,
                request.AcceptRule,
                request.PlayingServer,
                request.LicenseMinecraft,
                request.BuildingLevel,
                request.AdequacyLevel,
                request.Discription,
                token
                );
            } catch (Exception ex) {
                return Results.BadRequest(ex.Message);
            }


            return Results.Ok();
        }

    }
}
