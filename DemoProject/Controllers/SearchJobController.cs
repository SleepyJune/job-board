using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using DemoProject.Database;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace DemoProject.Controllers
{
    [ApiController]    
    public class SearchJobsController : ControllerBase
    {
        private JobOperations operations;

        public SearchJobsController()
        {
            operations = new JobOperations();
        }


        [Route("api/searchjobs/apply_url")]
        [HttpPost]
        public async Task<ActionResult<Job>> GetJobByApplyUrl([FromBody] Job jobObject)
        {
            var apply_url = jobObject.apply_url;

            using (var db = new DatabaseContext())
            {
                var job = await db.Jobs.FirstOrDefaultAsync(job => job.apply_url == apply_url);
                
                if(job != null)
                {
                    return Ok(job);
                }
                else
                {
                    return NotFound();
                }
            }            
        }
    }
}
