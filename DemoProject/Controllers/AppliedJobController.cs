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
    public class AppliedJobController : ControllerBase
    {
        public AppliedJobController()
        {

        }

        [HttpGet]
        public async Task<ActionResult<List<AppliedJob>>> Get(int user_id)
        {
            using(var db = new DatabaseContext())
            {
                var appliedList = await db.AppliedJobs
                                    .Where(applied => applied.user_id == user_id)
                                    .ToListAsync();

                return Ok(appliedList);
            }            
        }

        [HttpPost]
        public async Task<ActionResult<AppliedJob>> Post([FromBody] AppliedJob appliedJob)
        {
            using(var db = new DatabaseContext())
            {
                var prevJob = await db.AppliedJobs.FirstOrDefaultAsync(job => job.user_id == appliedJob.user_id && job.job_id == appliedJob.job_id);

                if(prevJob != null)
                {
                    db.AppliedJobs.Remove(prevJob);
                    await db.SaveChangesAsync();

                    return NoContent();
                }
                else
                {
                    appliedJob.apply_date = DateTime.Now;

                    await db.AppliedJobs.AddAsync(appliedJob);
                    await db.SaveChangesAsync();

                    return Ok(appliedJob);
                }
            }

            //return Forbid();
        }
    }
}
