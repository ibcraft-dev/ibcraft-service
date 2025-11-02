using AutoMapper;
using Ibcraft.Core.Module;
using Ibcraft.DataAccess.Entity;

namespace Ibcraft.DataAccess
{
    public class DatabaseMappings : Profile
    {
        public DatabaseMappings()
        {
            CreateMap<UserEntity, UserModule>().ConstructUsing(entity => new UserModule(
                    entity.Id,
                    entity.Nikname,
                    entity.Email,
                    entity.Password,
                    entity.UserAvatar,
                    entity.IsEmailConfirmed,
                    entity.EmailConfirmedToken,
                    entity.PasswordResetToken,
                    entity.Created_at
                ));

            CreateMap<QuestionnairePlayerEntity, QuestionnairePlayerModule>().ConstructUsing(entity => new QuestionnairePlayerModule(
                    entity.Id,
                    entity.UserId,
                    entity.Age,
                    entity.playingTime,
                    entity.AcceptRule,
                    entity.PlayingServer,
                    entity.LicenseMinecraft,
                    entity.BuildingLevel,
                    entity.AdequacyLevel,
                    entity.Discription,
                    entity.Status
                ));
        }
    }
}
