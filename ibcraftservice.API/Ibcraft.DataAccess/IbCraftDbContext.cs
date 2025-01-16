using Ibcraft.DataAccess.Entity;
using Microsoft.EntityFrameworkCore;

namespace Ibcraft.DataAccess
{
    public class IbCraftDbContext : DbContext
    {
        public IbCraftDbContext(DbContextOptions<IbCraftDbContext> options)
            : base(options)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
            AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);
        }

        public DbSet<UserEntity> Users { get; set; }
        public DbSet<QuestionnairePlayerEntity> Questions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
