using EliteAssist.Config;
using EliteJournalReader;
using EliteJournalReader.Events;
using System.Collections.Generic;
using WebSocketSharp.Server;

namespace EliteAssist.Services
{
    public interface INavigationService
    {

    }

    internal class NavigationService : WebSocketService, INavigationService
    {
        private NavRouteWatcher NavRouteWatcher;
        public NavRouteEvent.NavRouteEventArgs NavRoute;

        public NavigationService() : base()
        {
            NavRouteWatcher = new NavRouteWatcher(GameInfo.StandardDirectory.FullName);
            NavRouteWatcher.NavRouteUpdated += HandleNavRouteEvents;
            NavRouteWatcher.StartWatching();
        }

        public override string Resource { get => "/navigation"; }

        public void HandleNavRouteEvents(object sender, NavRouteEvent.NavRouteEventArgs eventArgs)
        {
            Logger.Debug($"NavRoute event received: {eventArgs}");
            NavRoute = eventArgs;
        }
    }
}
