using Ibcraft.Application.Entity;
using ibcraft.API.Endpoints;
using Microsoft.AspNetCore.Identity;

namespace ibcraft.API.Extensions;

public static class AdminCliExtensions
{
    public static async Task<bool> TryCreateAdminFromArgsAsync(this WebApplication app, string[] args)
    {
        if (!args.Contains("--create-admin"))
        {
            return false;
        }

        var email = GetArgValue(args, "--email")
            ?? Environment.GetEnvironmentVariable("ADMIN_EMAIL");
        var password = GetArgValue(args, "--password")
            ?? Environment.GetEnvironmentVariable("ADMIN_PASSWORD");
        var nickname = GetArgValue(args, "--nickname")
            ?? Environment.GetEnvironmentVariable("ADMIN_NICKNAME")
            ?? "admin";

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            Console.WriteLine("Usage: dotnet run --project ibcraftservice -- --create-admin --email admin@example.com --password StrongPass1! [--nickname admin]");
            Console.WriteLine("You can also use ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NICKNAME environment variables.");
            return true;
        }

        using var scope = app.Services.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();

        if (!await roleManager.RoleExistsAsync(AdminEndpoints.AdminRole))
        {
            var roleResult = await roleManager.CreateAsync(new IdentityRole<Guid>(AdminEndpoints.AdminRole));

            if (!roleResult.Succeeded)
            {
                PrintErrors("Unable to create Admin role", roleResult.Errors);
                return true;
            }
        }

        var user = await userManager.FindByEmailAsync(email);

        if (user is null)
        {
            user = new UserEntity
            {
                Nikname = nickname,
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                Created_at = DateTime.UtcNow
            };

            var createResult = await userManager.CreateAsync(user, password);

            if (!createResult.Succeeded)
            {
                PrintErrors("Unable to create admin user", createResult.Errors);
                return true;
            }
        }

        if (!await userManager.IsInRoleAsync(user, AdminEndpoints.AdminRole))
        {
            var addRoleResult = await userManager.AddToRoleAsync(user, AdminEndpoints.AdminRole);

            if (!addRoleResult.Succeeded)
            {
                PrintErrors("Unable to assign Admin role", addRoleResult.Errors);
                return true;
            }
        }

        Console.WriteLine($"Admin is ready: {email}");
        return true;
    }

    private static string? GetArgValue(string[] args, string name)
    {
        var index = Array.IndexOf(args, name);

        if (index < 0 || index + 1 >= args.Length)
        {
            return null;
        }

        return args[index + 1];
    }

    private static void PrintErrors(string title, IEnumerable<IdentityError> errors)
    {
        Console.WriteLine(title);

        foreach (var error in errors)
        {
            Console.WriteLine($"- {error.Description}");
        }
    }
}
