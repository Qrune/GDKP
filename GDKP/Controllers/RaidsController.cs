using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GDKP.Models;
using GDKP.ViewModels;

namespace GDKP.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RaidsController : ControllerBase
    {
        private readonly gdkpContext _context;
        public static readonly string _password = "111111";

        public RaidsController(gdkpContext context)
        {
            _context = context;
        }

        // GET: api/Raids

        [HttpGet]
        public async Task<List<Raids>> Get()
        {
            return await _context.Raids.OrderByDescending(r=> r.RaidDate).ToListAsync();
        }

        [HttpGet("{id}/groupSetting")]
        public Raids GetGroupSetting(int id)
        {
            return _context.Raids.SingleOrDefault(r => r.RaidId == id);
        }

        [HttpGet("{id}", Name = "GetRaidRecord")]
        public List<RaidRecord> Get(int id)
        {
            var data = (from re in _context.Records
                    join ra in _context.Raids on re.RaidId equals ra.RaidId
                    join p in _context.Players on re.PlayerId equals p.PlayerId
                    join it in _context.Items on re.ItemId equals it.ItemId
                    where re.RaidId == id
                    select new RaidRecord
                    {
                        recordId = re.RecordId,
                        itemName = it.ItemName,
                        buyerName = p.PlayerName,
                        amount = re.Amount,
                        comment = re.Comment
                    }).OrderByDescending(r => r.recordId).ToList();
            return data;

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            IFormCollection nvc = Request.Form;
            var password = nvc["password"];
            if (password != _password)
            {
                return Unauthorized();
            }
            var raid = new Raids();
            raid.RaidId = id;
            _context.Remove(raid);
            _context.SaveChanges();
            return Ok();
        }
        [HttpPut("{id}/updateGroup/")]
        public async Task<IActionResult> UpdateGroup(int id)
        {
            IFormCollection nvc = Request.Form;
            var password = nvc["password"];
            if (password != _password)
            {
                return Unauthorized();
            }
            var raid = _context.Raids.SingleOrDefault(r => r.RaidId == id);
            if (raid == null)
            {
                return NotFound();
            }
            raid.RaidPeople = Int32.Parse(nvc["raidPeople"]);
            raid.RaidSubsidyPeople = Int32.Parse(nvc["raidSubsidyPeople"]);
            raid.RaidTax = Int32.Parse(nvc["raidTax"]);
            _context.Raids.Update(raid);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            IFormCollection nvc = Request.Form;
            var name = nvc["name"];
            DateTime date = DateTime.Parse(nvc["date"]);
            Raids raid = new Raids(
            );
            raid.RaidName = name;
            raid.RaidDate = date;
            _context.Raids.Add(raid);
            await _context.SaveChangesAsync();
            return Ok();
        }

    }
}