using Ibcraft.DataAccess;
using Ibcraft.Infrastructure;
using ibcraft.API.Endpoints;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace ibcraft.API.Extensions
{
    public static class ApiExtensions
    {

        public static void AddMappedEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGroup("api").MapAuthUserEndpoints();
            app.MapGroup("api").MapAdminEndpoints();
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
            var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == Environments.Development;
            var secureCookiePolicy = isDevelopment
                ? CookieSecurePolicy.SameAsRequest
                : CookieSecurePolicy.Always;
            var oauthSameSite = isDevelopment
                ? SameSiteMode.Lax
                : SameSiteMode.None;

            services.AddAuthentication(opt =>
                {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddCookie("External", options =>
            {
                options.Cookie.SameSite = oauthSameSite;
                options.Cookie.SecurePolicy = secureCookiePolicy;
            })
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
                options.SignInScheme = "External";

                options.CorrelationCookie.SameSite = oauthSameSite;
                options.CorrelationCookie.SecurePolicy = secureCookiePolicy;

            })
            .AddOAuth("Discord", options =>
            {
                var clientId = configuration["Authentication:Discord:ClientId"];

                if (clientId == null)
                {
                    throw new ArgumentNullException(nameof(clientId));
                }

                var clientSecret = configuration["Authentication:Discord:ClientSecret"];

                if (clientSecret == null)
                {
                    throw new ArgumentNullException(nameof(clientSecret));
                }

                options.ClientId = clientId;
                options.ClientSecret = clientSecret;
                options.SignInScheme = "External";
                options.CallbackPath = "/signin-discord";
                options.AuthorizationEndpoint = "https://discord.com/api/oauth2/authorize";
                options.TokenEndpoint = "https://discord.com/api/oauth2/token";
                options.UserInformationEndpoint = "https://discord.com/api/users/@me";
                options.Scope.Add("identify");
                options.Scope.Add("email");

                options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
                options.ClaimActions.MapJsonKey(ClaimTypes.Name, "username");
                options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
                options.ClaimActions.MapJsonKey("urn:discord:avatar", "avatar");

                options.CorrelationCookie.SameSite = oauthSameSite;
                options.CorrelationCookie.SecurePolicy = secureCookiePolicy;

                options.Events = new OAuthEvents
                {
                    OnCreatingTicket = async context =>
                    {
                        using var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
                        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", context.AccessToken);

                        using var response = await context.Backchannel.SendAsync(
                            request,
                            HttpCompletionOption.ResponseHeadersRead,
                            context.HttpContext.RequestAborted);

                        response.EnsureSuccessStatusCode();

                        using var payload = JsonDocument.Parse(await response.Content.ReadAsStringAsync(context.HttpContext.RequestAborted));
                        context.RunClaimActions(payload.RootElement);
                    }
                };
            })
            .AddJwtBearer(options =>
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

            
            services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin", "Moderator"));
            });
        }
    }
}
