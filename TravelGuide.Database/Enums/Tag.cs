using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelGuide.Database.Enums
{
    [Flags]
    public enum Tag
    {
        None = 0,
        Hike = 1,
        Historical = 2,
        View = 4,
        Experience = 8,
        Food = 16
    }
}
