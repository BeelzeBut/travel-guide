using Microsoft.AspNetCore.Http;
using TravelGuide.Database.Enums;

namespace TravelGuide.WebAPI.DTOs
{
    public class NewLocationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public Tag Tags { get; set; }

        public string Description { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
        public Guid UserId { get; set; }
        public IEnumerable<IFormFile> Images {  get; set; } 
    }
}
