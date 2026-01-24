
using Ibcraft.Application.Abstracts;
using ibcraftservice.Core.Quesionnaire;
using Microsoft.AspNetCore.Mvc;

namespace ibcraft.API.Endpoints
{
    public static class QuesionnaireEndpoints
    {
        public static IEndpointRouteBuilder MapQuestionnaireEndpoints(this IEndpointRouteBuilder builder)
        {
            var endpoints = builder.MapGroup("/questionnaire/").RequireAuthorization();

            endpoints.MapPost("create", AddQuesionnaire);
            endpoints.MapGet("getall", GetAll);
            endpoints.MapGet("{id:guid}/status", Status);
            endpoints.MapGet("{id:guid}/view", GetView);
            endpoints.MapPut("{id:guid}/approved", ApprovedUpdate);
            endpoints.MapPut("{id:guid}/reject", RejectUpdate);
            endpoints.MapDelete("{id:guid}/delete", Delete);

            return builder;
        }

        private static async Task<IResult> AddQuesionnaire([FromBody] QuesionnaireRequest request, IQuestionnaireService service, HttpContext context)
        {
        
            await service.AddQuestionnaire(request);
            return Results.Ok();
        }

        private static async Task<IResult> GetView([FromRoute] Guid id, IQuestionnaireService service)
        {
            var data = await service.GetUserQuestionnaire(id);
            if (data == null) {
                return Results.Ok("Unfiled");
            }

            var response = new QuesionnaireResponse(
                data.Id,
                data.UserId,
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

        private static async Task<IResult> GetAll(HttpContext context, IQuestionnaireService service)
        {
            Console.WriteLine("Log");
            var quer = await service.GetAllQuestionnaire();

            var response = quer.Select(q => new QuesionnaireResponse(
                q.Id, 
                q.UserId, 
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
