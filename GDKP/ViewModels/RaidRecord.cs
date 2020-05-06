using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GDKP.ViewModels
{
    public class RaidRecord
    {
        public int recordId { get; set; }
        public string itemName { get; set; }
        public string buyerName { get; set; }
        public int amount { get; set; }
        public string comment { get; set; }
    }
}
