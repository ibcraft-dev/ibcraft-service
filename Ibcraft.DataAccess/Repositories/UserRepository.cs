
using AutoMapper;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Application.Entity;
using Microsoft.EntityFrameworkCore;
using System.Data;

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


        public async Task<UserEntity> GetByNikname(string nikname)
        {
            var userEntity = await _dbContext.Users
                .FirstOrDefaultAsync (u => u.Nikname == nikname);  

            return userEntity ?? null!;
        }

        public async Task<UserEntity?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken);

            return user;
        }

        public async Task<bool> UpdateNikname(Guid id, string nikname)
        {
            await _dbContext.Users
                .Where(u => u.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(u => u.Nikname, nikname));
            return true;
        }


        public async Task DeleteUser(Guid id)
        {
            await _dbContext.Users
                .Where (u => u.Id == id)
                .ExecuteDeleteAsync();
        }

        public async Task<bool> UpdateAvatarUrl(Guid UserId, string url)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Id == UserId);

            if (user == null)
            {
                return false;
            }

            user.UserAvatar = url;
            await _dbContext.SaveChangesAsync();
            return true;
        }



    }
}
