using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Xml;

namespace DemoProject.Database
{
    class JobDescriptionOperations
    {
        public async Task Add(JobDescription description)
        {
            using (var db = new DatabaseContext())
            {
                var job = await db.Jobs.FirstOrDefaultAsync(job => job.linkedin_id == description.linkedin_id);
                if(job != null)
                {
                    description.id = job.id;

                    var oldJD = db.JobDescriptions.Find(job.id);
                    if (oldJD == null)
                    {
                        await db.JobDescriptions.AddAsync(description);
                    }
                    else
                    {
                        oldJD.description = description.description;
                    }

                    await db.SaveChangesAsync();
                }
            }
        }

        public async Task<JobDescription> Get(int id)
        {
            using (var db = new DatabaseContext())
            {
                return await db.JobDescriptions.FindAsync(id);
            }
        }
    }
}