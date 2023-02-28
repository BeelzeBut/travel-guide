using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using TravelGuide.WebAPI.DTOs;
using TravelGuide.WebAPI.Services.Interfaces;

namespace TravelGuide.WebAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("getAllUsers")]
        public async Task<ActionResult> GetAllUsers()
        {
            return Ok(await _userService.GetAllUsersAsync());
        }


        [HttpGet("getUser/{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var result = await _userService.GetUserAsync(id);
            if (result is null)
                return BadRequest($"User {id} not found!");

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("validateUsername")]
        public async Task<bool> ValidateUniqueUsername(string username)
        {
            return await _userService.ValidateUniqueUsername(username);
        }

        [HttpPut("update/{id}")]
        public async Task<UserDto?> UpdateUser(Guid id, [FromBody] UserDto user)
        {
            return await _userService.UpdateUserAsync(id, user);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (result)
                return Ok();
            else
                return BadRequest($"User {id} does not exist!");
        }
    }
}