using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using ApiBackend.Persistence;

namespace ApiBackend.Controllers
{
    public class ApiModel
    {
        public int Id { get; set; }

        public ApiModel(int id)
        {
            Id = id;
        }

        public ApiModel() : this(-1)
        {
        }
    }
    
    public abstract class CachedRestController<T> : CorsEnabledController
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

        [Route("Get")]
        [HttpGet]
        // GET api/values
        public IEnumerable<T> Get() => Values;

        [Route("Get/{id}")]
        [HttpGet]
        // GET api/values/5
        public T Get(int id) => GetReferentially(id);

        [Route("Post")]
        [HttpPost]
        // POST api/values
        public T Post([FromBody]T value)
        {
            if (!CanAdd(value)) throw new Exception("Validation error");
            Values.Add(value);
            CommitChanges();
            value.Id = Values.Max(v => v.Id) + 1;
            return value;
        }

        [Route("Put")]
        [HttpPut]
        // PUT api/values/5
        public T Put(int id, [FromBody]T value)
        {
            var existing = GetReferentially(id);
            if (existing == null) throw new Exception($"Cannot find element with id {id}");
            PatchReflectively(value, existing);
            existing.Id = id; //ensure the id remains the same, as the patching might overwrite it
            CommitChanges();
            return existing;
        }

        [Route("Delete")]
        [HttpDelete]
        // DELETE api/values/5
        public void Delete(int id)
        {
            var existing = GetReferentially(id);
            if (existing == null) throw new Exception($"Cannot find element with id {id}");
            Values.Remove(existing);
            CommitChanges();
        }

        /// <summary>
        /// Virtual method to test whether a given value can be added to the Values list. Defaults
        /// to ensuring that its Id isn't already present in the list.
        /// </summary>
        protected virtual bool CanAdd(T value) => Values.All(v => v.Id != value.Id);

        /// <summary>
        /// Reflectively assigns the values of the properties of the 'to' object with the values
        /// of the properties of the 'from' object.
        /// </summary>
        private void PatchReflectively(T from, T to)
        {
            if (from == null || to == null || from.GetType() != to.GetType()) throw new Exception("Cannot patch null objects, or objects of mismatched types");
            var properties = typeof(T).GetProperties();
            foreach (var property in properties) property.SetValue(to, property.GetValue(from));
        }

        /// <summary>
        /// Commits changes to the Values list to the memory cache.
        /// </summary>
        private void CommitChanges() => MemoryCacher.Add(CacheKey, Values);

        /// <summary>
        /// Gets the item with the corresponding Id referentially, such that any changes made to
        /// the returned item will be reflected to the Values list.
        /// </summary>
        private T GetReferentially(int id) => Values.FirstOrDefault(v => v.Id == id);
    }
}
