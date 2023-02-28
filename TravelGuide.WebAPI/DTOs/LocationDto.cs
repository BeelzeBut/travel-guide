using System.Linq;
using TravelGuide.Database.Enums;
using TravelGuide.Database.Models;

namespace TravelGuide.WebAPI.DTOs
{
    public class LocationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public Tag Tags { get; set; }

        public string Description { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
        public IEnumerable<Guid> Images { get; set; }
    }


    public static class LocationDtoExtension
    {
        public static LocationDto ToDto(this Location location)
        {            
            return new LocationDto
            {
                Id = location.Id,
                Name = location.Name,
                Tags = location.Tags,
                Description = location.Description,
                Latitude = location.Latitude,
                Longitude = location.Longitude,
                Images = location.Images.Select(location => location.Id)
            };
        }

        public static Location ToModel(this NewLocationDto locationDto, User user, IEnumerable<Image> images)
        {
            return new Location
            {
                Name = locationDto.Name,
                Tags = locationDto.Tags,
                Description = locationDto.Description,
                Latitude = locationDto.Latitude,
                Longitude = locationDto.Longitude,
                UserId = user.Id,
                Images = (ICollection<Image>)images
            };
        }
    }
}
