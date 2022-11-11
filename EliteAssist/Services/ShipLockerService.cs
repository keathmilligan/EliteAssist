using EliteAssist.Config;
using EliteJournalReader;
using EliteJournalReader.Events;
using System.Collections.Generic;
using WebSocketSharp.Server;

namespace EliteAssist.Services
{
    public interface IShipLockerService
    {

    }

    internal class ShipLockerService : WebSocketService, IShipLockerService
    {
        private ShipLockerWatcher ShipLockerWatcher;
        public ShipLockerMaterialsEvent.ShipLockerMaterialsEventArgs ShipLocker;

        public ShipLockerService() : base()
        {
            ShipLockerWatcher = new ShipLockerWatcher(GameInfo.StandardDirectory.FullName);
            ShipLockerWatcher.ShipLockerUpdated += HandleShipLockerMaterialsEvents;
            ShipLockerWatcher.StartWatching();
        }

        public override string Resource { get => "/shiplocker"; }

        public void HandleShipLockerMaterialsEvents(object sender, ShipLockerMaterialsEvent.ShipLockerMaterialsEventArgs eventArgs)
        {
            Logger.Debug($"ShipLocker event received: {eventArgs}");
            ShipLocker = eventArgs;
        }
    }
}
