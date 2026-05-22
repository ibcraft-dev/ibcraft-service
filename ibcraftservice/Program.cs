
using Ibcraft.Application.Abstracts;
using Ibcraft.Application.Abstracts.Auth;
using Ibcraft.Application.Entity;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Application.Service;
using Ibcraft.DataAccess;
using Ibcraft.DataAccess.Repositories;
using Ibcraft.Infrastructure;
using ibcraft.API.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.HttpOverrides;

// builder
var builder = WebApplication.CreateBuilder(args);


var staticPath = Path.Combine(builder.Environment.ContentRootPath, "static");

if (!Directory.Exists(staticPath))
{
    Directory.CreateDirectory(staticPath);
}


var allowedCorsOrigins = builder.Configuration
    .GetSection("Cors:Origins")
    .Get<string[]>()?
    .Where(x => !string.IsNullOrWhiteSpace(x))
    .Select(x => x.Trim().TrimEnd('/'))
    .ToHashSet(StringComparer.OrdinalIgnoreCase) ?? [];

var clientAddress = builder.Configuration["Clientaddress"];
if (!string.IsNullOrWhiteSpace(clientAddress))
{
    allowedCorsOrigins.Add(clientAddress.Trim().TrimEnd('/'));
}

allowedCorsOrigins.Add("http://localhost:3000");

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrWhiteSpace(origin))
                {
                    return false;
                }

                var normalizedOrigin = origin.TrimEnd('/');
                if (allowedCorsOrigins.Contains(normalizedOrigin))
                {
                    return true;
                }

                if (!builder.Environment.IsDevelopment() || !Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                {
                    return false;
                }

                return uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase) ||
                       uri.Host.EndsWith(".ngrok-free.dev", StringComparison.OrdinalIgnoreCase);
            });
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddIdentity<UserEntity, IdentityRole<Guid>>(opt =>
{
    opt.Password.RequireDigit = true;
    opt.Password.RequireLowercase = true;
    opt.Password.RequireNonAlphanumeric = true;
    opt.Password.RequireUppercase = true;
    opt.Password.RequiredLength = 8;
    opt.User.RequireUniqueEmail = true;
}).AddEntityFrameworkStores<IbCraftDbContext>().AddDefaultTokenProviders();

builder.Services.ConfigureExternalCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.SameAsRequest
        : CookieSecurePolicy.Always;
});


builder.Services.AddDbContext<IbCraftDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(IbCraftDbContext)));
});
builder.Services.AddApiAuthentication(builder.Configuration);

builder.Services.AddScoped<IAuthProvider, AuthProvider>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IQuestionnaireRepository, QuestionnaireRepository>();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();

builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IQuestionnaireService, QuestionnaireService>();

builder.Services.AddHttpContextAccessor();
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                               ForwardedHeaders.XForwardedProto |
                               ForwardedHeaders.XForwardedHost;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// App
var app = builder.Build();
var log = app.Logger;


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
}

app.UseForwardedHeaders();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(staticPath),
    RequestPath = "/static"
});

if (app.Environment.IsDevelopment())
{
    app.Use(async (context, next) =>
    {
        if (context.Request.Headers.ContainsKey("Access-Control-Request-Private-Network"))
        {
            context.Response.Headers["Access-Control-Allow-Private-Network"] = "true";
        }

        await next();
    });
}

app.UseCors("CorsPolicy");
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    Secure = app.Environment.IsDevelopment()
        ? CookieSecurePolicy.SameAsRequest
        : CookieSecurePolicy.Always
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
// app.UseRouting();

app.MapControllers();
app.AddMappedEndpoints();

if (args.Contains("--migrate"))
    app.ApplyMigrations();

if (await app.TryCreateAdminFromArgsAsync(args))
    return;

app.Run();
