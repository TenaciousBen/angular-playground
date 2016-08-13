using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace ApiBackend.Controllers
{

    //[EnableCors("*", "*", "GET, POST, PUT, DELETE, OPTIONS")]
    public abstract class CorsEnabledController : ApiController
    {
    }
}
