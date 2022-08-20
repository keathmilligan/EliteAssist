using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteAssist
{
    internal class Utils
    {
        private static readonly DefaultContractResolver CamelCaseResolver = new DefaultContractResolver
        {
            NamingStrategy = new CamelCaseNamingStrategy()
        };
        private static JsonSerializerSettings SerializerSettings = new JsonSerializerSettings
        {
            ContractResolver = CamelCaseResolver,
            Formatting = Formatting.Indented,
        };
        public static string SerializeJSON(object value)
        {
            return JsonConvert.SerializeObject(value, SerializerSettings);
        }

        public static T DeserializeJSON<T>(string value)
        {
            return JsonConvert.DeserializeObject<T>(value, SerializerSettings);
        }
    }
}
