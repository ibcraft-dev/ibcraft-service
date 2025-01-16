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
                    entity.Created_at
                )); ;
        }
    }
}
