using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebService.Models {
  public interface IUserRepository {
    void Add(User item);
    IEnumerable<User> GetAll();
    User Find(int key);
    void Remove(int key);
    void Update(User item);
  }
}
