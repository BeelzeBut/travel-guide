using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelGuide.Database;
using TravelGuide.WebAPI.DTOs;
using TravelGuide.WebAPI.Services.Interfaces;

namespace TravelGuide.Services
{

    public class UserService : IUserService
    {
        private TravelGuideContext _dbContext;
        private IHashService _hashService;
        public UserService(TravelGuideContext context, IHashService hashService)
        {
            _dbContext = context;
            _hashService = hashService;
        }

        public async Task<UserDto?> GetUserAsync(Guid userId)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Id == userId);

            return user?.ToDto();
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _dbContext.Users.ToListAsync();
            return users.Select(u => u.ToDto());
        }
        public async Task<UserDto?> CreateUserAsync(UserDto userDto)
        {
            var user = userDto.ToModel(_hashService);
            user.Id = Guid.NewGuid();

            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            return user.ToDto();

        }
        public async Task<UserDto?> UpdateUserAsync(Guid userId, UserUpdateDto updatedUserDto)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Id == userId);
            if (user is null)
            {
                return null;
            }

            updatedUserDto.CopyToModel(user, _hashService);
            await _dbContext.SaveChangesAsync();

            return user.ToDto();
        }

        public async Task<bool> DeleteUserAsync(Guid userId)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Id == userId);
            if (user is null)
            {
                return false;
            }
            _dbContext.Users.Remove(user);
            var result = await _dbContext.SaveChangesAsync();

            return result > 0;
        }

        public async Task<bool> ValidateUniqueUsername(string username)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Username == username);

            return user == null;
        }
    }
}