using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using ApiBackend.Persistence;

namespace ApiBackend.Controllers
{
    public class Value : ApiModel
    {
        public string Name { get; set; }

        public Value(int id, string name)
        {
            Id = id;
            Name = name;
        }
    }

    [AllowAnonymous]
    public class ValuesController : CachedRestController<Value>
    {
        public ValuesController() 
            : base("Values",
                  new List<Value>
                  {
                      new Value(1, "one"),
                      new Value(2, "two"),
                      new Value(3, "three")
                  })
        { }
    }
}
