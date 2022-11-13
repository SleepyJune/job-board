using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace DemoProject
{
    public class JobDescription
    {
        [Key]
        public int id { get; set; }
        public long linkedin_id { get; set; }
        public string description { get; set; }
    }
}