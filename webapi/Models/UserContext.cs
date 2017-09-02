using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebService.Models {
  public class UserContext: DbContext {
    public DbSet<User> Users { get; set; }

    public UserContext(DbContextOptions<UserContext> options): base(options) {
      
    }
  }
}
