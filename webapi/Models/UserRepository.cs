using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace WebService.Models {
  public class UserRepository: IUserRepository {
    private readonly UserContext context;

    public UserRepository(UserContext context) {
      this.context = context;

      this.Add(new User { DisplayName = "Item1" });
    }

    public IEnumerable<User> GetAll() {
      return this.context.Users.ToList();
    }

    public void Add(User item) {
      this.context.Users.Add(item);
      this.context.SaveChanges();
    }

    public User Find(int userId) {
      return this.context.Users.FirstOrDefault(t => t.Id == userId);
    }

    public void Remove(int userId) {
      User user = this.context.Users.First(t => t.Id == userId);

      this.context.Users.Remove(user);
      this.context.SaveChanges();
    }

    public void Update(User item) {
      this.context.Users.Update(item);
      this.context.SaveChanges();
    }
  }
}
