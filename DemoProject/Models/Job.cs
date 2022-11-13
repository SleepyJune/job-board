using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace DemoProject
{
    public class Job
    {
        [Key]
        public int id { get; set; }
        public long linkedin_id { get; set; }
        public string job_title { get; set; }
        public string location { get; set; }
        public string company_name { get; set; }
        public bool work_remote { get; set; }
        public string apply_url { get; set; }
        public DateTime listed_date { get; set; }
    }
}