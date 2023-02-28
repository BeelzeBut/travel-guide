using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelGuide.WebAPI.DTOs;
using TravelGuide.WebAPI.Services.Interfaces;

namespace TravelGuide.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]

    public class LocationController : Controller
    {
        private ILocationService _locationService;

        public LocationController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet("getAllLocations")]
        public async Task<ActionResult> GetAllLocations()
        {
            return Ok(await _locationService.GetAllLocationsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetAllLocations(Guid id)
        {
            return Ok(await _locationService.GetLocationAsync(id));
        }

        [HttpPost("create")]
        public async Task<LocationDto?> Post([FromForm] NewLocationDto location)
        {
            return await _locationService.CreateLocationAsync(location);
        }
    }
}
