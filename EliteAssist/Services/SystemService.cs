using WebSocketSharp.Server;
using NLog;
using TypeGen.Core.TypeAnnotations;

namespace EliteAssist.Services
{
    [ExportTsClass]
    public class SystemInfo
    {
        public string Name { get; set; }
    }

    internal class SystemService : WebSocketService
    {
        public SystemService() : base()
        {
        }

        public override string Resource { get => "/system"; }
    }
}
