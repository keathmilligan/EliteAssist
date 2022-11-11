using EliteAssist.Config;
using EliteJournalReader;
using EliteJournalReader.Events;
using WebSocketSharp.Server;

namespace EliteAssist.Services
{
    public interface ICargoService
    {

    }

    internal class CargoService : WebSocketService, ICargoService
    {
        private CargoWatcher CargoWatcher;
        public CargoEvent.CargoEventArgs Cargo;

        public CargoService() : base()
        {
            CargoWatcher = new CargoWatcher(GameInfo.StandardDirectory.FullName);
            CargoWatcher.CargoUpdated += HandleCargoEvents;
            CargoWatcher.StartWatching();
        }

        public override string Resource { get => "/cargo"; }

        public void HandleCargoEvents(object sender, CargoEvent.CargoEventArgs eventArgs)
        {
            Logger.Debug($"Cargo event received: {eventArgs}");
            Cargo = eventArgs;
        }
    }
}
