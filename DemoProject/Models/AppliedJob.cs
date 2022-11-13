using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace DemoProject
{
    public class AppliedJob
    {
        [Key]
        public int id { get; set; }
        public int user_id { get; set; }
        public int job_id { get; set; }
        public DateTime apply_date { get; set; }
    }
}
