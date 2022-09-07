using System.Collections.Generic;
using WebSocketSharp.Server;
using EliteJournalReader;
using EliteJournalReader.Events;

namespace EliteAssist
{
    internal class HotKeysService : Service
    {
        public HotKeysService(WebSocketServer webSocketServer) : base(webSocketServer)
        {
        }

        public override string Resource { get => "/hotkeys"; }

        protected override void HandleClientRequest(ClientRequest request)
        {
            switch (request.Method)
            {
                case "GET":
                    break;
            }
        }
    }
}
