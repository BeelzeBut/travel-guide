using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TravelGuide.WebAPI.DTOs;
using TravelGuide.Database;
using TravelGuide.Database.Models;
using TravelGuide.WebAPI.Services.Interfaces;

namespace TravelGuide.Services
{
    public class LocationService : ILocationService
    {
        private TravelGuideContext _dbContext;
        public LocationService(TravelGuideContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<LocationDto?> CreateLocationAsync(NewLocationDto locationDto)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == locationDto.UserId);
            if (user is null)
            {
                return null;
            }

            List<Image> locationImages = new List<Image>();
            foreach (var image in locationDto.Images)
            {
                if (image.Length > 0)
                {
                    // TODO: Upload images to Azure Storage
                }
            }

            var location = locationDto.ToModel(user, locationImages);
            await _dbContext.Locations.AddAsync(location);
            foreach (var image in locationImages)
            {
                await _dbContext.Images.AddAsync(image);
            }
            await _dbContext.SaveChangesAsync();
            return location.ToDto();
        }

        public async Task<IEnumerable<LocationDto>> GetAllLocationsAsync()
        {
            var locations = await _dbContext.Locations.Include(l => l.Images).ToListAsync();

            return locations.Select(location => location.ToDto());
        }

        public async Task<LocationDto?> GetLocationAsync(Guid locationId)
        {
            var location = await _dbContext.Locations.FirstOrDefaultAsync(location => location.Id == locationId);
            return location?.ToDto();
        }
    }
}