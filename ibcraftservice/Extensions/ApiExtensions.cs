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
            })
                .AddCookie()
                .AddGoogle(options =>
                {
                    var clientId = configuration["Authentication:Google:ClientId"];

                    if (clientId == null)
                    {
                        throw new ArgumentNullException(nameof(clientId));
                    }

                    var clientSecret = configuration["Authentication:Google:ClientSecret"];

                    if (clientSecret == null)
                    {
                        throw new ArgumentNullException(nameof(clientSecret));
                    }
                    options.ClientId = clientId;
                    options.ClientSecret = clientSecret;
                    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;

                })
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
            


            services.AddAuthorization();
        }
    }
}
