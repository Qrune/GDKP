using System;
using System.Collections.Generic;

namespace GDKP.Models
{
    public partial class Records
    {
        public int RaidId { get; set; }
        public int? ItemId { get; set; }
        public int? PlayerId { get; set; }
        public int Amount { get; set; }
        public string Comment { get; set; }
        public int RecordId { get; set; }

        public virtual Items Item { get; set; }
        public virtual Players Player { get; set; }
        public virtual Raids Raid { get; set; }
    }
}
