

using Ibcraft.DataAccess.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ibcraft.DataAccess.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasMany(q => q.Questions)
                .WithOne(q => q.User)
                .HasForeignKey(x => x.UserId);

            builder.HasMany(r => r.Roles)
                .WithMany(u => u.Users)
                .UsingEntity<UserRoleEntity>(
                    l => l.HasOne<RoleEntity>().WithMany().HasForeignKey(x => x.RoleId),
                    r => r.HasOne<UserEntity>().WithMany().HasForeignKey(x => x.UserId)
                );

        }
    }
}
