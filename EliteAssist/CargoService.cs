using EliteJournalReader;
using EliteJournalReader.Events;
using WebSocketSharp.Server;

namespace EliteAssist
{
    internal class CargoService : Service
    {
        private CargoWatcher CargoWatcher;
        public CargoEvent.CargoEventArgs Cargo;

        public CargoService(WebSocketServer webSocketServer) : base(webSocketServer)
        {
            CargoWatcher = new CargoWatcher(GameInfo.StandardDirectory.FullName);
            CargoWatcher.CargoUpdated += HandleCargoEvents;
            CargoWatcher.StartWatching();
        }

        public override string Resource { get => "/cargo"; }

        protected override void HandleClientRequest(ClientRequest request)
        {
            switch (request.Method)
            {
                case "GET":
                    SendClientMessage(Cargo);
                    break;
            }
        }

        public void HandleCargoEvents(object sender, CargoEvent.CargoEventArgs eventArgs)
        {
            Logger.Debug($"Cargo event received: {eventArgs}");
            Cargo = eventArgs;
        }

        public void Refresh()
        {
            SendClientMessage(Cargo);
        }
    }
}
