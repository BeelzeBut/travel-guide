using System.Security.Claims;
using TravelGuide.WebAPI.DTOs;

namespace TravelGuide.WebAPI.Services.Interfaces
{
    public interface IAuthenticationService
    {
        public Task<ClaimsPrincipal?> LoginAsync(string username, string password);
        public Task<bool> LogoutAsync();
        public Task<UserDto> GetUserAsync(string username, string password);
    }
}
