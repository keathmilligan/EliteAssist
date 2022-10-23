using EliteAssist.Config;
using EliteJournalReader;
using EliteJournalReader.Events;
using WebSocketSharp.Server;

namespace EliteAssist.Services
{
    public class BackpackService : WebSocketService
    {
        public static BackPackWatcher BackPackWatcher;
        public static BackPackEvent.BackPackEventArgs BackPack;

        public BackpackService() : base()
        {
            BackPackWatcher = new BackPackWatcher(GameInfo.StandardDirectory.FullName);
            BackPackWatcher.BackPackUpdated += HandleBackPackEvents;
            BackPackWatcher.StartWatching();
        }

        public override string Resource { get => "/backpack"; }

        public void HandleBackPackEvents(object sender, BackPackEvent.BackPackEventArgs eventArgs)
        {
            Logger.Debug($"backpack event received: {eventArgs}");
            BackPack = eventArgs;
        }
    }
}
