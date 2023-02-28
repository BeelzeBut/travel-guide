using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using TravelGuide.Database.Enums;

namespace TravelGuide.Database.Models
{
    public class Location
    {
        [Key]
        public Guid Id { get; set; }

        public string Name { get; set; }

        public Tag Tags { get; set; }

        public string Description { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
        public Guid UserId { get; set; }
        public virtual User User { get; set; }

        public ICollection<Image> Images { get; set; }
        public ICollection<Review> Reviews { get; set; }

    }
}
