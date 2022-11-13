using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

using DemoProject.Database;

namespace DemoProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private UserOperations operations;

        public UserController()
        {
            operations = new UserOperations();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> Get()
        {
            var allUsers = await operations.GetAll();
            return Ok(allUsers);            
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] User user)
        {
            await operations.Add(user);
            return Ok();
        }
    }
}
