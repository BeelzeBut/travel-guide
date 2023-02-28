using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelGuide.Database.Enums;
using TravelGuide.Database.Models;
using TravelGuide.Services;
using TravelGuide.WebAPI.Services.Interfaces;

namespace TravelGuide.WebAPI.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public UserType UserType { get; set; }

    }

    public static class UserDtoExtension
    {
        public static UserDto ToDto(this User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Username = user.Username,
                UserType = user.UserType
            };
        }

        public static User ToModel(this UserDto userDto, IHashService hashService)
        {
            return new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Username = userDto.Username,
                PasswordHash = hashService.Hash(userDto.Password),
                UserType = userDto.UserType
            };
        }

        public static User ToModel(this UserDto userDto, IHashService hashService, Guid userId, string password)
        {
            return new User
            {
                Id = userId,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Username = userDto.Username,
                PasswordHash = hashService.Hash(userDto.Password),
                UserType = userDto.UserType
            };
        }

        public static void CopyToModel(this UserDto userDto, User user, IHashService hashService)
        {
            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.Username = userDto.Username;
            user.UserType = userDto.UserType;
            if (!string.IsNullOrWhiteSpace(userDto.Password))
            {
                user.PasswordHash = hashService.Hash(userDto.Password);
            }
        }
    }
}
