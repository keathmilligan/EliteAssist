using EliteJournalReader;
using EliteJournalReader.Events;
using System.Collections.Generic;
using WebSocketSharp.Server;

namespace EliteAssist
{
    internal class NavigationService : Service
    {
        private NavRouteWatcher NavRouteWatcher;
        public NavRouteEvent.NavRouteEventArgs NavRoute;

        public NavigationService(WebSocketServer webSocketServer) : base(webSocketServer)
        {
            NavRouteWatcher = new NavRouteWatcher(GameInfo.StandardDirectory.FullName);
            NavRouteWatcher.NavRouteUpdated += HandleNavRouteEvents;
            NavRouteWatcher.StartWatching();
        }

        public override string Resource { get => "/navigation"; }

        protected override void HandleClientRequest(ClientRequest request)
        {
            switch (request.Method)
            {
                case "GET":
                    SendClientMessage(NavRoute);
                    break;
            }
        }

        public void HandleNavRouteEvents(object sender, NavRouteEvent.NavRouteEventArgs eventArgs)
        {
            Logger.Debug($"NavRoute event received: {eventArgs}");
            NavRoute = eventArgs;
        }

        public void Refresh()
        {
            SendClientMessage(NavRoute);
        }
    }
}
