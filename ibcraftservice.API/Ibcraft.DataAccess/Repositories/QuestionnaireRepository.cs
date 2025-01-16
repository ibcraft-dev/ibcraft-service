
using AutoMapper;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Core.Module;
using Ibcraft.DataAccess.Entity;
using Microsoft.EntityFrameworkCore;

namespace Ibcraft.DataAccess.Repositories
{
    public class QuestionnaireRepository : IQuestionnaireRepository
    {
        private readonly IbCraftDbContext _dbContext;
        private readonly IMapper _mapper;

        public QuestionnaireRepository(IbCraftDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }


        public async Task Add(QuestionnairePlayerModule playerEntity)
        {
            var entity = new QuestionnairePlayerEntity
            {
                Id = playerEntity.Id,
                UserId = playerEntity.UserId,
                Age = playerEntity.Age,
                AcceptRule = playerEntity.AcceptRule,
                PlayingServer = playerEntity.PlayingServer,
                LicenseMinecraft = playerEntity.LicenseMinecraft,
                BuildingLevel = playerEntity.BuildingLevel,
                AdequacyLevel = playerEntity.AdequacyLevel,
                Discription = playerEntity.Discription,
                Status = playerEntity.Status,
            };

            await _dbContext.Questions.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<QuestionnairePlayerModule>> GetAll()
        {
            var entity = await _dbContext.Questions
                .AsNoTracking().ToListAsync();

            return _mapper.Map<List<QuestionnairePlayerModule>>(entity);
        }
    }
}
