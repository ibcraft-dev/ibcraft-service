
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Application.Entity;
using Microsoft.EntityFrameworkCore;

namespace Ibcraft.DataAccess.Repositories
{
    public class QuestionnaireRepository : IQuestionnaireRepository
    {
        private readonly IbCraftDbContext _dbContext;


        public QuestionnaireRepository(IbCraftDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task Add(QuestionnairePlayerEntity entity)
        {

            await _dbContext.Questions.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<QuestionnairePlayerEntity>> GetAll()
        {
            return await _dbContext.Questions
                .AsNoTracking().ToListAsync();

        }

        public async Task<QuestionnairePlayerEntity> GetOneUserQuestionnaire(Guid userId)
        {
            return await _dbContext.Questions
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.UserId == userId) ?? null!;
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
