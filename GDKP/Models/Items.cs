using System;
using System.Collections.Generic;

namespace GDKP.Models
{
    public partial class Items
    {
        public Items()
        {
            Records = new HashSet<Records>();
        }

        public string ItemName { get; set; }
        public int ItemId { get; set; }

        public virtual ICollection<Records> Records { get; set; }
    }
}
