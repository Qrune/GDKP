using System;
using System.Collections.Generic;

namespace GDKP.Models
{
    public partial class Raids
    {
        public Raids()
        {
            Records = new HashSet<Records>();
        }

        public int RaidId { get; set; }
        public DateTime? RaidDate { get; set; }
        public string RaidName { get; set; }
        public int? RaidPeople { get; set; }
        public int? RaidSubsidyPeople { get; set; }
        public int? RaidTax { get; set; }
        public string RaidWcl { get; set; }

        public virtual ICollection<Records> Records { get; set; }
    }
}
