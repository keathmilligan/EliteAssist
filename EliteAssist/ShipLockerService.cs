using EliteJournalReader;
using EliteJournalReader.Events;
using System.Collections.Generic;
using WebSocketSharp.Server;

namespace EliteAssist
{
    internal class ShipLockerService : Service
    {
        private ShipLockerWatcher ShipLockerWatcher;
        public ShipLockerMaterialsEvent.ShipLockerMaterialsEventArgs ShipLocker;

        public ShipLockerService(WebSocketServer webSocketServer) : base(webSocketServer)
        {
            ShipLockerWatcher = new ShipLockerWatcher(GameInfo.StandardDirectory.FullName);
            ShipLockerWatcher.ShipLockerUpdated += HandleShipLockerMaterialsEvents;
            ShipLockerWatcher.StartWatching();
        }

        public override string Resource { get => "/shiplocker"; }

        protected override void HandleClientRequest(ClientRequest request)
        {
            switch (request.Method)
            {
                case "GET":
                    SendClientMessage(ShipLocker);
                    break;
            }
        }

        public void HandleShipLockerMaterialsEvents(object sender, ShipLockerMaterialsEvent.ShipLockerMaterialsEventArgs eventArgs)
        {
            Logger.Debug($"ShipLocker event received: {eventArgs}");
            ShipLocker = eventArgs;
        }

        public void Refresh()
        {
            SendClientMessage(ShipLocker);
        }
    }
}
