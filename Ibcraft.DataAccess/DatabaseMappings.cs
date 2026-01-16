using AutoMapper;
using Ibcraft.Core.Module;
using Ibcraft.Application.Entity;


namespace Ibcraft.DataAccess
{
    public class DatabaseMappings : Profile
    {
        public DatabaseMappings()
        {
            CreateMap<QuestionnairePlayerEntity, QuestionnairePlayerModule>()
                .ForCtorParam("id", opt => opt.MapFrom(src => src.Id))
                .ForCtorParam("userid", opt => opt.MapFrom(src => src.UserId))
                .ForCtorParam("age", opt => opt.MapFrom(src => src.Age))
                .ForCtorParam("playingTime", opt => opt.MapFrom(src => src.playingTime))
                .ForCtorParam("acceptRole", opt => opt.MapFrom(src => src.AcceptRule))
                .ForCtorParam("playingServer", opt => opt.MapFrom(src => src.PlayingServer))
                .ForCtorParam("licenseMinecraft", opt => opt.MapFrom(src => src.LicenseMinecraft))
                .ForCtorParam("buildingLevel", opt => opt.MapFrom(src => src.BuildingLevel))
                .ForCtorParam("adequacyLevel", opt => opt.MapFrom(src => src.AdequacyLevel))
                .ForCtorParam("discription", opt => opt.MapFrom(src => src.Discription))
                .ForCtorParam("status", opt => opt.MapFrom(src => src.Status));
        }
    }
}
