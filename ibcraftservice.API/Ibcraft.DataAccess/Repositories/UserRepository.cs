
using AutoMapper;
using Ibcraft.Application.Interfaces.Repositories;
using Ibcraft.Core.Module;
using Ibcraft.DataAccess.Entity;
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

        public async Task<UserModule> GetById(Guid Id)
        {
            var userEntity = await _dbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync (u => u.Id == Id);
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

        public async Task<bool> UpdateNikname(Guid id, string nikname)
        {
            await _dbContext.Users
                .Where(u => u.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(u => u.Nikname, nikname));
            return true;
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

        public async Task<(bool, string)> ForgotPasword(string email)
        {
            var user =  await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return (false, string.Empty);
            }
            string token = Guid.NewGuid().ToString();

            user.PasswordResetToken = token;
            user.TokenExpiration = DateTime.UtcNow.AddHours(1);
            await _dbContext.SaveChangesAsync();
            return (true, token);
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

        public async Task<bool> IsResetTokenValid(string email, string token)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == email && u.PasswordResetToken == token);

            if (user == null)
            {
                return false;
            }

            if (user.TokenExpiration < DateTime.UtcNow)
            {
                user.TokenExpiration = null;
                return false;
            }

            return true;
        }

        public async Task<bool> ResetPassword(string newPasswordHash, string token)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == token && u.TokenExpiration > DateTime.UtcNow);
            if (user == null)
            {
                return false;
            }

            user.Password = newPasswordHash;
            user.PasswordResetToken = string.Empty;
            user.TokenExpiration = null;

            await _dbContext.SaveChangesAsync();
            return true;
        }


    }
}
