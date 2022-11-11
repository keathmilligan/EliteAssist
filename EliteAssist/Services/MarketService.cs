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

    public interface IMarketService
    {

    }

    internal class MarketService : WebSocketService, IMarketService
    {
        public MarketService() : base()
        {
        }

        public override string Resource { get => "/market"; }
    }
}
