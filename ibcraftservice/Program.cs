using Ibcraft.Application.Abstracts.Auth;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Application.Service;
using Ibcraft.DataAccess;
using Ibcraft.DataAccess.Repositories;
using Ibcraft.Infrastructure;
using ibcraftservice.Extensions;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

// builder
var builder = WebApplication.CreateBuilder(args);


var staticPath = Path.Combine(builder.Environment.ContentRootPath, "static");

if (!Directory.Exists(staticPath))
{
    Directory.CreateDirectory(staticPath);
}


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApiAuthentication(builder.Configuration);

builder.Services.AddDbContext<IbCraftDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(IbCraftDbContext)));
});

builder.Services.AddScoped<IAuthProvider, AuthProvider>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IQuestionnaireRepository, QuestionnaireRepository>();

builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<QuestionnaireService>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddAutoMapper(typeof(DatabaseMappings).Assembly);

builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection(nameof(EmailOptions)));

builder.Services.AddCors(opti =>
{
    var client = builder.Configuration.GetSection("Clientaddress");
    if (!string.IsNullOrEmpty(client.Value))
    {
        opti.AddPolicy("AllowSpecificOrigin", builder => {
            builder.WithOrigins(client.Value)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
        });
    } 
});

// App
var app = builder.Build();
var log = app.Logger;


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(staticPath),
    RequestPath = "/static"
});


app.UseHttpsRedirection();

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    HttpOnly = HttpOnlyPolicy.None,
    Secure = CookieSecurePolicy.Always,
    
});

app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();
app.AddMappedEndpoints();

if (args.Contains("--migrate"))
    app.ApplyMigrations(log);

app.Run();
