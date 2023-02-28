using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelGuide.Database.Enums;

namespace TravelGuide.Database.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Username { get; set; }

        public string PasswordHash { get; set; }

        public UserType UserType { get; set; }

        public List<Location> Locations { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
    }
}
