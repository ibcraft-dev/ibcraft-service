
using AutoMapper;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Core.Module;
using Ibcraft.DataAccess.Entity;
using Microsoft.EntityFrameworkCore;

namespace Ibcraft.DataAccess.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IbCraftDbContext _dbContext;
        private readonly IMapper _mapper;

        public UserRepository(IbCraftDbContext dbContext, IMapper mapper) { 
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task Add(UserModule user)
        {
            
            var userEntity = new UserEntity
            {
                Id = user.Id,
                Email = user.Email,
                Nikname = user.Nikname,
                Password = user.Password,
                IsEmailConfirmed = false,
                EmailConfirmedToken = user.EmailConfirmedToken,
                Created_at = DateTime.Now,
            };

            await _dbContext.Users.AddAsync(userEntity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> ConfirmEmailAsync(string email, string token)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email && u.EmailConfirmedToken == token);
            if (user == null)
                return false;

            user.IsEmailConfirmed = true;
            user.EmailConfirmedToken = string.Empty;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<UserModule> GetByEmail(string email)
        {
            var userEntity = await _dbContext.Users.
                AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email) ?? null;
            var map = _mapper.Map<UserModule>(userEntity);
            return map;
        }

        public async Task<List<UserModule>> GetAll()
        {
            var userEntity = await _dbContext.Users
                .AsNoTracking()
                .ToListAsync();
            return _mapper.Map<List<UserModule>>(userEntity);
        }

        public async Task UpdateNikname(Guid id, string nikname)
        {
            await _dbContext.Users
                .Where(u => u.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(u => u.Nikname, nikname));
        }


        public async Task UpdatePassword(Guid id, string passwordHeash)
        {
            await _dbContext.Users
                .Where (u => u.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(u => u.Password, passwordHeash));
        }

        public async Task DeleteUser(Guid id)
        {
            await _dbContext.Users
                .Where (u => u.Id == id)
                .ExecuteDeleteAsync();
        }


    }
}
