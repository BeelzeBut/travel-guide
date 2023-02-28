using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace TravelGuide.WebAPI.DTOs
{
    public class ImageDto
    {
        public Guid Id {  get; set; }
        public Guid LocationId {  get; set; }
        public IFormFile Image { get; set; }
    }
}
