using EliteJournalReader;
using EliteJournalReader.Events;
using WebSocketSharp.Server;

namespace EliteAssist
{
    internal class BackPackService : Service
    {
        public static BackPackWatcher BackPackWatcher;
        public static BackPackEvent.BackPackEventArgs BackPack;

        public BackPackService(WebSocketServer webSocketServer) : base(webSocketServer)
        {
            BackPackWatcher = new BackPackWatcher(GameInfo.StandardDirectory.FullName);
            BackPackWatcher.BackPackUpdated += HandleBackPackEvents;
            BackPackWatcher.StartWatching();
        }

        public override string Resource { get => "/backpack"; }

        protected override void HandleClientRequest(ClientRequest request)
        {
            switch (request.Method)
            {
                case "GET":
                    SendClientMessage(BackPack);
                    break;
            }
        }

        public void HandleBackPackEvents(object sender, BackPackEvent.BackPackEventArgs eventArgs)
        {
            Logger.Debug($"backpack event received: {eventArgs}");
            BackPack = eventArgs;
        }

        public void Refresh()
        {
            SendClientMessage(BackPack);
        }
    }
}
