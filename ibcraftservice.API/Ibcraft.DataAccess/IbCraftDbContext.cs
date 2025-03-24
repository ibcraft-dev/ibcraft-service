using Ibcraft.DataAccess.Configurations;
using Ibcraft.DataAccess.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Ibcraft.DataAccess
{
    public class IbCraftDbContext : DbContext
    {
        private readonly AuthorizationOptions _authOptions;

        public IbCraftDbContext(DbContextOptions<IbCraftDbContext> options, IOptions<AuthorizationOptions> authOptions)
            : base(options)
        {
            _authOptions = authOptions.Value;
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
            AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);
        }

        public DbSet<UserEntity> Users { get; set; }
        public DbSet<QuestionnairePlayerEntity> Questions { get; set; }
        public DbSet<RoleEntity> Roles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(IbCraftDbContext).Assembly);
            modelBuilder.ApplyConfiguration(new RolePermissionConfiguration(_authOptions));
        }

    }
}
