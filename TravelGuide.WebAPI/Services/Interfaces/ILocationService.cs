using TravelGuide.WebAPI.DTOs;

namespace TravelGuide.WebAPI.Services.Interfaces
{
    public interface ILocationService
    {
        public Task<LocationDto?> GetLocationAsync(Guid locationId);
        public Task<IEnumerable<LocationDto>> GetAllLocationsAsync();
        public Task<LocationDto?> CreateLocationAsync(NewLocationDto locationDto);
        public Task<LocationDto?> UpdateLocationAsync(Guid locationId, NewLocationDto locationDto);
        public Task<bool> DeleteLocationAsync(Guid locationId);
    }
}
