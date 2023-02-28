using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelGuide.Database.Models;
using TravelGuide.Services;
using TravelGuide.WebAPI.DTOs;
using TravelGuide.WebAPI.Services.Interfaces;

namespace TravelGuide.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : Controller
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ITokenService _tokenService;
        private readonly IUserService _userService;

        public AuthenticationController(
            IAuthenticationService authenticationService,
            ITokenService tokenService,
            IUserService userService
            )
        {
            _authenticationService = authenticationService;
            _tokenService = tokenService;
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
            {
                return RedirectToAction("Error");
            }

            var validUser = await _authenticationService.GetUserAsync(model.Username, model.Password);

            if (validUser == null)
                return NotFound();

            var token = _tokenService.BuildToken(validUser);

            if (token is null)
            {
                return (RedirectToAction("Error"));

            }

            var expiration = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() + _tokenService.GetExpirationInMilliseconds();
            var loginDataDto = new LoginDto
            {
                UserId = validUser.Id,
                Token = token,
                Expiration = expiration,
                FirstName = validUser.FirstName,
                LastName = validUser.LastName,
                UserType = validUser.UserType,
            };
            return Ok(loginDataDto);
        }

        [HttpPost("register")]
        public async Task<UserDto?> Register([FromBody] UserDto user)
        {
            return await _userService.CreateUserAsync(user);
        }

    }
}

