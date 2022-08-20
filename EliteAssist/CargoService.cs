using System.Collections.Generic;
using WebSocketSharp.Server;

namespace EliteAssist
{
    internal class CargoService : Service<CargoService>
    {
        protected override void _Initialize(WebSocketServer webSocketServer)
        {
            base._Initialize(webSocketServer);
        }

        public override string Resource { get => "/someresource"; }

        protected override void _HandleClientRequest(ClientRequest request)
        {
        }

        public static void SomeCommand(List<string> qargs)
        {
        }
    }
}
