using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GDKP.Models;

namespace GDKP.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RecordsController : ControllerBase
    {
        private readonly gdkpContext _context;

        public RecordsController(gdkpContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Raids>> Get()
        {
            return await _context.Raids.ToListAsync();
        }

        // GET: api/Records/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

     

        // POST: api/Records
        [HttpPost]
        public int Post()
        {
            IFormCollection nvc = Request.Form;
            int raidId = Int32.Parse(nvc["raidId"]);
            string itemName = nvc["itemName"];
            int price = Int32.Parse(nvc["price"]);
            string comment = nvc["comment"];
            string buyerName = nvc["buyerName"];
            int playerId = 0;
            int itemId = 0;

            var player = _context.Players.SingleOrDefault(p => p.PlayerName == buyerName);
            if (player == null)
            {
                Players newPlayer = new Players();
                newPlayer.PlayerName = buyerName;
                _context.Players.Add(newPlayer);
                _context.SaveChanges();
                playerId = newPlayer.PlayerId;
            }
            else
            {
                playerId = player.PlayerId;
            }
            var item = _context.Items.SingleOrDefault(i => i.ItemName == itemName);
            if (item == null)
            {
                Items newItem = new Items();
                newItem.ItemName = itemName;
                _context.Items.Add(newItem);
                _context.SaveChanges();
                itemId = newItem.ItemId;
            }
            else
            {
                itemId = item.ItemId;
            }
            Records newRecord = new Records();
            newRecord.ItemId = itemId;
            newRecord.PlayerId = playerId;
            newRecord.RaidId = raidId;
            newRecord.Comment = comment;
            newRecord.Amount = price;
            _context.Records.Add(newRecord);
            _context.SaveChanges();
            return newRecord.RecordId;
        }

        // PUT: api/Records/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            IFormCollection nvc = Request.Form;
            var password = nvc["password"];
            if (password != RaidsController._password)
            {
                return Unauthorized();
            }
            var record = new Records();
            record.RecordId = id;
            _context.Remove(record);
            _context.SaveChanges();
            return Ok();
        }
    }
}
