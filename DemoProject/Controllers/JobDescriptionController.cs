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
    [Route("api/job_description")]
    public class JobDescriptionController : ControllerBase
    {
        private JobDescriptionOperations operations;

        public JobDescriptionController()
        {
            operations = new JobDescriptionOperations();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobDescription>>> Get(int id)
        {
            var description = await operations.Get(id);
            return Ok(description);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] JobDescription jobDescription)
        {
            await operations.Add(jobDescription);
            return Ok();
        }
    }
}
