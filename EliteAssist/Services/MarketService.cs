using WebSocketSharp.Server;
using NLog;
using TypeGen.Core.TypeAnnotations;

namespace EliteAssist.Services
{
    [ExportTsClass]
    public class MarketInfo
    {
        public string Name { get; set; }
    }

    internal class MarketService : WebSocketService
    {
        public MarketService() : base()
        {
        }

        public override string Resource { get => "/market"; }
    }
}
