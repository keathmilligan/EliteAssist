using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
            //Formatting = Formatting.Indented,
        };
        public static string SerializeJSON(object value)
        {
            return JsonConvert.SerializeObject(value, SerializerSettings);
        }

        public static T DeserializeJSON<T>(string value)
        {
            return JsonConvert.DeserializeObject<T>(value, SerializerSettings);
        }

        public static object DeserializeObject(string value, Type type)
        {
            return JsonConvert.DeserializeObject(value, type, SerializerSettings);
        }
    }

    public class ObjectTostringConverter : JsonConverter<string>
    {
        public override bool CanRead => true;
        public override bool CanWrite => true;

        public override string ReadJson(JsonReader reader, Type objectType, string existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            var data = JToken.ReadFrom(reader);
            if (!data.HasValues)
            {
                return null;
            }
            else
            {
                return data.ToString();
            }
        }

        public override void WriteJson(JsonWriter writer, string value, JsonSerializer serializer)
        {
            writer.WriteRaw(value);
        }
    }
}
