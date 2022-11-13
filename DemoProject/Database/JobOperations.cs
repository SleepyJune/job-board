using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore.Internal;

namespace DemoProject.Database
{
    class JobOperations
    {
        public async Task Add(Job job)
        {
            using (var db = new DatabaseContext())
            {
                await db.Jobs.AddAsync(job);
                await db.SaveChangesAsync();
            }
        }

        public async Task Delete(int id)
        {
            using (var db = new DatabaseContext())
            {
                var job = await db.Jobs.FindAsync(id);
                if (job == null)
                    return;

                db.Jobs.Remove(job);
                await db.SaveChangesAsync();
            }
        }

        public async Task<Job> Get(int id)
        {
            using (var db = new DatabaseContext())
            {
                return await db.Jobs.FindAsync(id);
            }
        }

        public async Task<IEnumerable<Job>> GetAll()
        {
            using (var db = new DatabaseContext())
            {
                return await db.Jobs.ToListAsync();
            }
        }

        public async Task<IEnumerable<Job>> Get(int pageIndex, int pageSize, string job_title, string company_name, int? applied_user_id)
        {
            if (company_name != null)
            {
                company_name = company_name.ToLower();
            }

            if (job_title != null)
            {
                job_title = job_title.ToLower();
            }

            using (var db = new DatabaseContext())
            {
                IQueryable<Job> jobs = db.Jobs;

                if (applied_user_id != null)
                {
                    jobs = (from applied in db.AppliedJobs
                            join job in db.Jobs on applied.job_id equals job.id
                            where applied.user_id == applied_user_id
                            select job);
                }

                return await jobs
                    .Where(job => company_name == null || job.company_name.ToLower().Contains(company_name))
                    .Where(job => job_title == null || job.job_title.ToLower().Contains(job_title))
                    .OrderByDescending(job => job.listed_date)
                    .Skip((pageIndex - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }
        }
    }
}