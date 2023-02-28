using TravelGuide.WebAPI.DTOs;

namespace TravelGuide.WebAPI.Services.Interfaces
{
    public interface ITokenService
    {
        public string BuildToken(UserDto user);
        public bool IsTokenValid(string key, string issuer, string token);

        public int GetExpirationInMilliseconds();

    }
}
