using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using DemoProject.Database;

namespace DemoProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : ControllerBase
    {
        private JobOperations operations;

        public JobController()
        {
            operations = new JobOperations();
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> Get(int page, string job_title = null, string company_name = null, int? applied_user_id = null)
        {
            var jobs = await operations.Get(page, 25, job_title, company_name, applied_user_id);
            jobs = JobFilter(jobs);

            return Ok(jobs);
        }

        private IEnumerable<Job> JobFilter(IEnumerable<Job> allJobs)
        {
            allJobs = allJobs.Where(job => !FilterJobByTitle(job));

            return allJobs;
        }

        private bool FilterJobByTitle(Job job)
        {
            var excludeWords = new string[] { "senior", "lead", "principal", "manager", "staff", "sr." };
            
            foreach(var word in excludeWords)
            {
                if (job.job_title.ToLower().Contains(word))
                {
                    return true;
                }
            }

            return false;                
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Job job)
        {
            await operations.Add(job);
            return Ok();
        }
    }
}
