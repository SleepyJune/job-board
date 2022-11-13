using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Database
{
    class UserOperations
    {
        public async Task Add(User user)
        {
            using (var db = new DatabaseContext())
            {
                await db.Users.AddAsync(user);
                await db.SaveChangesAsync();
            }
        }

        public async Task Delete(int id)
        {
            using (var db = new DatabaseContext())
            {
                var user = await db.Users.FindAsync(id);
                if (user == null)
                    return;

                db.Users.Remove(user);
                await db.SaveChangesAsync();
            }
        }

        public async Task<User> Get(int id)
        {
            using (var db = new DatabaseContext())
            {
                return await db.Users.FindAsync(id);
            }
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            using (var db = new DatabaseContext())
            {
                return await db.Users.ToListAsync();
            }
        }
    }
}