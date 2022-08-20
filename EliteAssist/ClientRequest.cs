using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteAssist
{
    internal class ClientRequest
    {
        public string Method { get; set; }
        public string Resource { get; set; }
        public string Body { get; set; }
    }
}
