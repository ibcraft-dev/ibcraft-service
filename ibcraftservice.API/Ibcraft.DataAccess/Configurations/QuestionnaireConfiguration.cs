
using Ibcraft.DataAccess.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ibcraft.DataAccess.Configurations
{
    public class QuestionnaireConfiguration : IEntityTypeConfiguration<QuestionnairePlayerEntity>
    {
        public void Configure(EntityTypeBuilder<QuestionnairePlayerEntity> builder)
        {
            builder.HasKey(c => c.Id);

            builder.HasOne(c => c.User)
                .WithMany(u => u.Questions);
        }
    }
}
