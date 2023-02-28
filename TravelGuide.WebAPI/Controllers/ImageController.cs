using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelGuide.WebAPI.Services.Interfaces;

namespace TravelGuide.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ImageController : Controller
    {
        private IImageService _imageService;

        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public IActionResult GetImage(Guid id)
        {
            var image = _imageService.GetImageAsync(id);
            return RedirectToAction("Image not found");
        }
    }
}
