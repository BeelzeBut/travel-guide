using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TravelGuide.WebAPI.DTOs;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using TravelGuide.Database;
using System.Web.Helpers;
using TravelGuide.WebAPI.Services.Interfaces;

namespace TravelGuide.Services
{

    public class HashService : IHashService
    {
        private TravelGuideContext _dbContext;
        public HashService(TravelGuideContext dbContext)
        {
            _dbContext = dbContext;
        }

        public string Hash(string password)
        {
            var hash = Crypto.HashPassword(password);
            return hash;
        }

        public bool VerifyPassword(string password, string hash)
        {
            return Crypto.VerifyHashedPassword(hash, password);
        }
    }
}