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
    public class LoginController : ControllerBase
    {
        public LoginController()
        {

        }

        [HttpPost]
        public async Task<ActionResult<User>> Login([FromBody] User cred)
        {
            using(var db = new DatabaseContext())
            {
                var user = await db.Users.FirstOrDefaultAsync(user => user.email == cred.email);
                if(user == null)
                {
                    return NotFound();
                }

                if(user.password != cred.password)
                {
                    return NotFound();
                }

                return Ok(user);
            }
        }
    }
}
