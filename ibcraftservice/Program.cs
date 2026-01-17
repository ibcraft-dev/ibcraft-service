
using Ibcraft.Application.Abstracts;
using Ibcraft.Application.Abstracts.Auth;
using Ibcraft.Application.Entity;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Application.Service;
using Ibcraft.DataAccess;
using Ibcraft.DataAccess.Repositories;
using Ibcraft.Infrastructure;
using ibcraftservice.Extensions;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Identity;
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


builder.Services.AddIdentity<UserEntity, IdentityRole<Guid>>(opt =>
{
    opt.Password.RequireDigit = true;
    opt.Password.RequireLowercase = true;
    opt.Password.RequireNonAlphanumeric = true;
    opt.Password.RequireUppercase = true;
    opt.Password.RequiredLength = 8;
    opt.User.RequireUniqueEmail = true;
}).AddEntityFrameworkStores<IbCraftDbContext>();


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
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.AddMappedEndpoints();

if (args.Contains("--migrate"))
    app.ApplyMigrations();

app.Run();
