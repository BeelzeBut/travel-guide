using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelGuide.Database.Models
{
    public class Review
    {
        public Guid Id { get; set; }
        /// <summary>
        /// 1 - Bad,
        /// 5 - Awesome
        /// </summary>
        public int Rating { get; set; }
        public string Body { get; set; }
        public Guid UserId { get; set; }
        public Guid LocationId { get; set; }
        public DateTime CreatedAt { get; set; }
        public virtual User User { get; set; }
        public virtual Location Location { get; set; }
    }
}
