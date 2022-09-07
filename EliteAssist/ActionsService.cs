using System.Collections.Generic;
using WebSocketSharp.Server;
using EliteJournalReader;
using EliteJournalReader.Events;

namespace EliteAssist
{
    internal class ActionsService : Service
    {
        public ActionsService(WebSocketServer webSocketServer) : base(webSocketServer)
        {
        }

        public override string Resource { get => "/actions"; }

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
