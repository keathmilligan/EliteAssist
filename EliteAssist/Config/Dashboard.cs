using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeGen.Core.TypeAnnotations;

namespace EliteAssist.Config
{
    [ExportTsClass]
    public class Dashboard
    {
        [TsOptional]
        public long? Id { get; set; }
        public string Name { get; set; }
        public bool Overlay { get; set; }
        public bool ClickThrough { get; set; }
        public bool Titlebar { get; set; }
    }
}
