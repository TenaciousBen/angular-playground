using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using ApiBackend.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace ApiBackend.Controllers
{
    [Authorize]
    [RoutePrefix("api/Account")]
    public class AccountController : CorsEnabledController
    {
        private ApplicationUserManager _userManager;

        public AccountController(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }

        public AccountController()
        {
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        [HttpPost]
        public async Task<IHttpActionResult> Register([FromBody]RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser() { UserName = model.Email, Email = model.Email };

            IdentityResult result = await UserManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        [Route("AddRole")]
        [HttpPost]
        public async Task<IHttpActionResult> AddRole([FromBody]UserRoleModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserManager.FindByEmailAsync(model.Email);
            var isInRole = await UserManager.IsInRoleAsync(user.Id, model.RoleName);
            if (isInRole) return Ok();
            var roleResult = UserManager.AddToRole(user.Id, model.RoleName);

            if (!roleResult.Succeeded)
            {
                return GetErrorResult(roleResult);
            }

            return Ok();
        }

        [Route("RemoveRole")]
        [HttpPost]
        public async Task<IHttpActionResult> RemoveRole([FromBody]UserRoleModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserManager.FindByEmailAsync(model.Email);
            var isInRole = await UserManager.IsInRoleAsync(user.Id, model.RoleName);
            if (!isInRole) return Ok();
            var roleResult = UserManager.RemoveFromRole(user.Id, model.RoleName);

            if (!roleResult.Succeeded)
            {
                return GetErrorResult(roleResult);
            }

            return Ok();
        }

        [Route("GetRoles")]
        [HttpGet]
        public async Task<IHttpActionResult> GetRoles([FromUri]EmailModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserManager.FindByEmailAsync(model.Email);
            var roles = await UserManager.GetRolesAsync(user.Id);
            return Ok(roles);
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
    }
}