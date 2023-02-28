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
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;
using TravelGuide.Database;
using TravelGuide.WebAPI.DTOs;
using TravelGuide.WebAPI.Services.Interfaces;

namespace TravelGuide.Services
{
    public class TokenService : ITokenService
    {
        private TravelGuideContext _dbContext;
        private IConfiguration _config;

        private const int EXPIRATION_TIMER = 30;

        public TokenService(TravelGuideContext dbContext, IConfiguration config)
        {
            _dbContext = dbContext;
            _config = config;   
        }

        public string BuildToken(UserDto user)
        {
            string key = _config["Jwt:Key"].ToString();
            string issuer = _config["Jwt:Issuer"].ToString();

            var claims = new[] {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.UserType.ToString()),
            new Claim(ClaimTypes.NameIdentifier,
            Guid.NewGuid().ToString())
             };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new JwtSecurityToken(
                issuer, 
                issuer,
                claims,
                expires: DateTime.Now.AddMinutes(EXPIRATION_TIMER),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        public bool IsTokenValid(string key, string issuer, string token)
        {
            var mySecret = Encoding.UTF8.GetBytes(key);
            var mySecurityKey = new SymmetricSecurityKey(mySecret);
            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                tokenHandler.ValidateToken(token,
                new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = issuer,
                    ValidAudience = issuer,
                    IssuerSigningKey = mySecurityKey,
                }, out SecurityToken validatedToken);
            }
            catch
            {
                return false;
            }
            return true;
        }

        public int GetExpirationInMilliseconds()
        {
            return EXPIRATION_TIMER * 1000 * 60;
        }
    }
}