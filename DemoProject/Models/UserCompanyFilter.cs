using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace DemoProject
{
    public class UserCompanyFilter
    {
        [Key]
        public int id { get; set; }
        public int user_id { get; set; }
        public string company_name { get; set; }
    }
}