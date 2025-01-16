using Ibcraft.Application.Interfaces.Auth;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Application.Service;
using Ibcraft.DataAccess;
using Ibcraft.DataAccess.Repositories;
using Ibcraft.Infrastructure;
using ibcraftservice.Extensions;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApiAuthentication(builder.Configuration);

builder.Services.AddDbContext<IbCraftDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(IbCraftDbContext)));
});

builder.Services.AddScoped<IAuthProvider, AuthProvider>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IEmailProvider,  EmailProvider>();

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<UserService>();

builder.Services.AddAutoMapper(typeof(DatabaseMappings).Assembly);

builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection(nameof(EmailOptions)));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.AddMappedEndpoints();


app.Run();
