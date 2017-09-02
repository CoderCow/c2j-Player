using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebService.Models;

namespace WebService.Controllers {
  [Route("api/[controller]")]
  public class UsersController : Controller {
    private readonly IUserRepository userRepository;

    public UsersController(IUserRepository userRepository) {
      this.userRepository = userRepository;
    }

    /// <summary>
    ///   Gets a value!
    /// </summary>
    /// <returns>RETURN VALUE</returns>
    [HttpGet]
    public IEnumerable<User> Get() {
      return this.userRepository.GetAll();
    }

    [HttpGet("{id}", Name = "GetUser")]
    public IActionResult Get(int id) {
      User user = this.userRepository.Find(id);
      if (user == null)
        return this.NotFound();

      return new ObjectResult(user);
    }

    [HttpPost]
    public IActionResult Post([FromBody] User user) {
      if (user == null)
        return this.BadRequest();

      this.userRepository.Add(user);

      return this.CreatedAtRoute("GetUser", new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] User userUpdates) {
      if (userUpdates == null || userUpdates.Id != id)
        return this.BadRequest();

      User user = this.userRepository.Find(id);
      if (user == null)
        return this.NotFound();
      
      user.DisplayName = userUpdates.DisplayName;
      user.EMail = userUpdates.EMail;

      this.userRepository.Update(user);
      return new NoContentResult();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id) {
      User user = this.userRepository.Find(id);
      if (user == null)
        return this.NotFound();

      this.userRepository.Remove(id);
      return new NoContentResult();
    }
  }
}
