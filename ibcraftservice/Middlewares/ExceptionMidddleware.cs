
using ibcraft.API.Contracts;

namespace ibcraft.API.Middlewares
{
    public class ExceptionMidddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            } catch (Exception ex)
            {
                context.Response.StatusCode = 500;

                var errorResponse = new ErrorResponse(500, ex.Message);
                await context.Response.WriteAsJsonAsync(errorResponse);
            }
        }
    }
}
