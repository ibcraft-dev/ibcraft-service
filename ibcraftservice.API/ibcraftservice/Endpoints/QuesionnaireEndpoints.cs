
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

            return builder;
        }

        private static async Task GetAll(HttpContext context)
        {
            throw new NotImplementedException();
        }

        private static async Task<IResult> AddQuesionnaire([FromBody] QuesionnaireRequest request, QuestionnaireService questionnaireService ,HttpContext context)
        {
            var token = context.Request.Cookies["cookiesdragon"];

            if (string.IsNullOrEmpty(token))
            {
                return Results.Unauthorized();
            }

            await questionnaireService.AddQuestionnaire(request.Age,
                request.AcceptRule,
                request.PlayingServer,
                request.LicenseMinecraft,
                request.BuildingLevel,
                request.AdequacyLevel,
                request.Discription,
                token
                );

            return Results.Ok();
        }
    }
}
