using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;
using TravelGuide.Database;
using TravelGuide.WebAPI.Services.Interfaces;

namespace TravelGuide.Services
{
    public class ImageService : IImageService
    {
        private TravelGuideContext _dbContext;

        public ImageService(TravelGuideContext context)
        {
            _dbContext = context;
        }

        public Task<byte[]> GetImageAsync(string imagePath)
        {
            // TODO: Get image from Azure Storage using imagePath
            return null;
        }

        public async Task<byte[]> GetImageAsync(Guid imageId)
        {
            var image = await _dbContext.Images.FirstOrDefaultAsync(i => i.Id == imageId);

            // TODO: Get image from Azure Storage using imagePath
            return null;
        }
    }
}