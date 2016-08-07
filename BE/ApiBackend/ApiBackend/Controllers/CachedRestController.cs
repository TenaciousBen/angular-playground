using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using ApiBackend.Persistence;

namespace ApiBackend.Controllers
{
    public class ApiModel
    {
        public int Id { get; set; }
    }

    [EnableCors("*", "*", "GET, POST, PUT, DELETE, OPTIONS")]
    public abstract class CachedRestController<T> : ApiController
        where T : ApiModel
    {
        private MemoryCacher MemoryCacher { get; set; } = new MemoryCacher();
        protected string CacheKey { get; private set; }
        private List<T> Values { get; set; }

        protected CachedRestController(string cacheKey, List<T> defaultValues)
        {
            CacheKey = cacheKey;
            var inCache = MemoryCacher.GetValue(CacheKey) as List<T>;
            if (inCache == null) MemoryCacher.Add(CacheKey, defaultValues);
            Values = inCache ?? defaultValues;
        }

        // GET api/values
        public IEnumerable<T> Get() => Values;

        // GET api/values/5
        public T Get(int id) => GetReferentially(id);

        // POST api/values
        public void Post([FromBody]T value)
        {
            if (!CanAdd(value)) throw new Exception("Validation error");
            Values.Add(value);
            CommitChanges();
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]T value)
        {
            var existing = GetReferentially(id);
            if (existing == null) throw new Exception($"Cannot find element with id {id}");
            PatchReflectively(value, existing);
            existing.Id = id; //ensure the id remains the same, as the patching might overwrite it
            CommitChanges();
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
            var existing = GetReferentially(id);
            if (existing == null) throw new Exception($"Cannot find element with id {id}");
            Values.Remove(existing);
            CommitChanges();
        }

        protected virtual bool CanAdd(T value) => Values.All(v => v.Id != value.Id);

        private void PatchReflectively(T from, T to)
        {
            var properties = typeof(T).GetProperties();
            foreach (var property in properties) property.SetValue(to, property.GetValue(from));
        }

        private void CommitChanges() => MemoryCacher.Add(CacheKey, Values);

        private T GetReferentially(int id) => Values.FirstOrDefault(v => v.Id == id);
    }
}
