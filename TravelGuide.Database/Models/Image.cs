using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelGuide.Database.Models
{
    public class Image
    {
        public Guid Id { get; set; }
        public Guid LocationId { get; set; }
        public string ImagePath
        {
            get
            {
                return $"{LocationId}/{Id}";
            }
        }
    }
}
