using System;
using System.Collections.Generic;

namespace GDKP.Models
{
    public partial class Players
    {
        public Players()
        {
            Records = new HashSet<Records>();
        }

        public int PlayerId { get; set; }
        public string PlayerName { get; set; }

        public virtual ICollection<Records> Records { get; set; }
    }
}
