using Ibcraft.Application.Interfaces.Service;
using Ibcraft.Application.Service;
using Ibcraft.Core.Enums;
using Ibcraft.Infrastructure.Authentication;
using ibcraftservice.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ibcraftservice.Extensions
{
    public static class ApiExtensions
    {
        public static void AddMappedEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapUsersEndpoints();
            app.MapQuestionnaireEndpoints();
        }

        public static void AddApiAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<AuthOption>(configuration.GetSection(nameof(AuthOption)));

            var jwtOptions = configuration.GetSection(nameof(AuthOption)).Get<AuthOption>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
                {
                    options.RequireHttpsMetadata = true;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new()
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions!.SecretKey))
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            context.Token = context.Request.Cookies["dragonkey"];

                            return Task.CompletedTask;
                        },

                        OnChallenge = context =>
                        {
                            context.HandleResponse();

                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            context.Response.ContentType = "application/json";

                            var response = new
                            {
                                error = "Unauthorized",
                                message = "Token is missing, invalid, or expired."
                            };

                            return context.Response.WriteAsJsonAsync(response);
                        }

                    };
                });
            services.AddScoped<IPermissionService, PermissionService>();
            services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();

            services.AddAuthorization();    
        }

        public static IEndpointConventionBuilder RequirePermissions<TBuilder>(this TBuilder buider,
            params Permission[] permissions) where TBuilder : IEndpointConventionBuilder
        {
            return buider.RequireAuthorization(policy => 
                policy.AddRequirements(new PermissionRequirement(permissions)));
        }
    }
}
