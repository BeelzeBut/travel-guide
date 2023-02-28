using TravelGuide.WebAPI.DTOs;

namespace TravelGuide.WebAPI.Services.Interfaces
{
    public interface IUserService
    {
        public Task<UserDto?> GetUserAsync(Guid userId);
        public Task<UserDto?> CreateUserAsync(UserDto userDto);
        public Task<UserDto?> UpdateUserAsync(Guid userId, UserDto user);
        public Task<bool> DeleteUserAsync(Guid userId);
        public Task<bool> ValidateUniqueUsername(string username);
        public Task<IEnumerable<UserDto>> GetAllUsersAsync();

    }
}
