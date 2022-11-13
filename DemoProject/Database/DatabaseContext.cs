using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

using System.Configuration;

namespace DemoProject.Database
{
    class DatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobDescription> JobDescriptions { get; set; }
        public DbSet<AppliedJob> AppliedJobs { get; set; }
        public DbSet<UserCompanyFilter> UserCompanyFilters { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["database-1"].ConnectionString;

            optionsBuilder.UseNpgsql(connectionString);
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(e => e.ToTable("users"));
            modelBuilder.Entity<Job>(e => e.ToTable("jobs"));
            modelBuilder.Entity<JobDescription>(e => e.ToTable("job_descriptions"));
            modelBuilder.Entity<AppliedJob>(e => e.ToTable("applied_jobs"));
            modelBuilder.Entity<UserCompanyFilter>(e => e.ToTable("user_company_filter"));

            base.OnModelCreating(modelBuilder);
        }
    }
}