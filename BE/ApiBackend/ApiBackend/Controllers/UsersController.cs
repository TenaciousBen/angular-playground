using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ApiBackend.Controllers
{
    [Authorize]
    [RoutePrefix("api/Users")]
    public class UsersController : CachedRestController<UserViewModel>
    {
        public UsersController() 
            : base("Users", 
                  new List<UserViewModel>
                  {
                      new UserViewModel(1, "Foo")
                  })
        { }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Route("AdminFunction")]
        public string AdminFunction([FromBody] AdminFunctionViewModel adminFunctionViewModel)
        {
            return "You're an admin, Harry: " + adminFunctionViewModel.Text;
        }
    }

    public class AdminFunctionViewModel
    {
        public string Text { get; set; }
    }

    public class UserViewModel : ApiModel
    {
        public string UserName { get; set; }

        public UserViewModel(int id, string userName) : base(id)
        {
            UserName = userName;
        }
    }
}