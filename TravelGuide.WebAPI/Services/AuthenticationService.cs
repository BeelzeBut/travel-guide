using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TravelGuide.Database;
using TravelGuide.WebAPI.DTOs;
using TravelGuide.WebAPI.Services.Interfaces;

namespace TravelGuide.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private TravelGuideContext _dbContext;
        private IHashService _hashService;
        public AuthenticationService(TravelGuideContext dbContext, IHashService hashService)
        {
            _dbContext = dbContext;
            _hashService = hashService;
        }

        public async Task<UserDto?> GetUserAsync(string username, string password)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Username == username);

            if (user != null)
            {
                if (!_hashService.VerifyPassword(password, user.PasswordHash))
                    return null;

                return user.ToDto();
            }
            return null;
        }

        public async Task<ClaimsPrincipal?> LoginAsync(string username, string password)
        {
            string hash = _hashService.Hash(password);

            var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Username == username);
            if (user is null || !_hashService.VerifyPassword(password, user.PasswordHash))
                return null;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, user.UserType.ToString()),
            };

            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);

            return new ClaimsPrincipal(claimsIdentity);
        }

        public Task<bool> LogoutAsync()
        {
            throw new NotImplementedException();
        }
    }
}