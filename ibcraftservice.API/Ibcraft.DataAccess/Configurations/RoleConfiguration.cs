using Ibcraft.Core.Enums;
using Ibcraft.DataAccess.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ibcraft.DataAccess.Configurations
{
    public partial class RoleConfiguration : IEntityTypeConfiguration<RoleEntity>
    {
        public void Configure(EntityTypeBuilder<RoleEntity> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasMany(p => p.Permissions)
                .WithMany(r => r.Roles)
                .UsingEntity<RolePermissionEntity>(
                    l => l.HasOne<PermissionEntity>().WithMany().HasForeignKey(x => x.PermissionId),
                    r => r.HasOne<RoleEntity>().WithMany().HasForeignKey(x => x.RoleId)
                );

            var roles = Enum
                .GetValues<Role>()
                .Select(Role => new RoleEntity
                {
                    Id = (int)Role,
                    Name = Role.ToString()
                });
            builder.HasData(roles);
        }
    }
}
