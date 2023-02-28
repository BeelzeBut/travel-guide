using TravelGuide.Database.Enums;

namespace TravelGuide.WebAPI.DTOs
{
    class LoginDto
    {
        public Guid UserId { get; set; }
        public string Token { get; set; }
        public long Expiration { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public UserType UserType { get; set; }

    }
}
