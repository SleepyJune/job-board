using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using DemoProject.Database;
using Microsoft.EntityFrameworkCore;

namespace DemoProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserCompanyFilterController : ControllerBase
    {
        public UserCompanyFilterController()
        {

        }

        [HttpGet]
        public async Task<ActionResult<List<UserCompanyFilter>>> Get(int user_id)
        {
            using (var db = new DatabaseContext())
            {
                var filters = await db.UserCompanyFilters
                    .Where(filter => filter.user_id == user_id)
                    .ToListAsync();

                return Ok(filters);
            }
        }

        [HttpPost]
        public async Task<ActionResult> Add([FromBody] UserCompanyFilter filter)
        {
            using (var db = new DatabaseContext())
            {
                await db.UserCompanyFilters.AddAsync(filter);
                await db.SaveChangesAsync();

                return Ok();
            }
        }

        [HttpDelete]
        public async Task<ActionResult> Delete([FromBody] UserCompanyFilter filter)
        {
            using (var db = new DatabaseContext())
            {
                var target = await db.UserCompanyFilters.FirstOrDefaultAsync(f => f.user_id == filter.user_id && f.company_name == filter.company_name);

                if (target != null)
                {
                    db.UserCompanyFilters.Remove(target);
                    await db.SaveChangesAsync();

                    return Ok();
                }
            }

            return NotFound();
        }
    }
}
