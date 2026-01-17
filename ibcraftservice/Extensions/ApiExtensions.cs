using Ibcraft.DataAccess;
using Ibcraft.Infrastructure;
using ibcraftservice.Endpoints;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ibcraftservice.Extensions
{
    public static class ApiExtensions
    {

        public static void AddMappedEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGroup("api").MapAuthUserEndpoints();
            app.MapGroup("api").MapQuestionnaireEndpoints();
        }

        public static void ApplyMigrations(this WebApplication app)
        {
          using var scope = app.Services.CreateScope();
          var db = scope.ServiceProvider.GetRequiredService<IbCraftDbContext>();
          db.Database.Migrate();        
        }

        public static void AddApiAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<AuthOption>(configuration.GetSection(nameof(AuthOption)));

            var jwtOptions = configuration.GetSection(nameof(AuthOption)).Get<AuthOption>();

            services.AddAuthentication(opt =>
                {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                var jwtOptions = configuration.GetSection(AuthOption.JwtOptionsKey)
                    .Get<AuthOption>() ?? throw new ArgumentException(nameof(AuthOption));

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey))
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["ACCESS_TOKEN"];
                        return Task.CompletedTask;
                    }
                };
            });

            
            services.AddAuthorization();
        }
    }
}
