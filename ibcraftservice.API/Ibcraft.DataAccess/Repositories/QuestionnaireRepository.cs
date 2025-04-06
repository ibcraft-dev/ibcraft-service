
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
                playingTime = playerEntity.PlayingTime,
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


        public async Task<QuestionnairePlayerModule> GetOneQuestionnaire(Guid id)
        {
            var entity = await _dbContext.Questions 
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id) ?? null;

            return _mapper.Map<QuestionnairePlayerModule>(entity);
        }

        public async Task<QuestionnairePlayerModule> GetUserOneQuestionnaire(Guid userid)
        {
            var entity = await _dbContext.Questions
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == userid) ?? null;

            return _mapper.Map<QuestionnairePlayerModule>(entity);
        }

        public async Task<string> ApproveQuestionnaire(Guid id)
        {
            var entity = await _dbContext.Questions
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
            {
                throw new ArgumentException("Not found.");
            }

            entity.Status = "Approved";
            await _dbContext.SaveChangesAsync();
            return $"Update status user {entity.Status}, for {entity.UserId}";
        }

        public async Task<string> RejectQuestionnaire(Guid id)
        {
            var entity = await _dbContext.Questions
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
            {
                throw new ArgumentException("Not found.");
            }

            entity.Status = "Reject";
            await _dbContext.SaveChangesAsync();
            return $"Update status user {entity.Status}, for {entity.UserId}";
        }

        public async Task DeleteQuestionnaire(Guid id)
        {
            await _dbContext.Questions
                .Where(q => q.Id == id)
                .ExecuteDeleteAsync();
        }


    }
}
