using System.Collections.Generic;
using WebSocketSharp.Server;
using EliteJournalReader;
using EliteJournalReader.Events;

namespace EliteAssist
{
    internal class DashboardService : Service
    {
        public DashboardService(WebSocketServer webSocketServer) : base(webSocketServer)
        {
        }

        public override string Resource { get => "/dashboard"; }

        protected override void HandleClientRequest(ClientRequest request)
        {
            switch (request.Method)
            {
                case "list":
                    break;
                case "create":
                    break;
                case "update":
                    break;
                case "delete":
                    break;
            }
        }
    }
}
