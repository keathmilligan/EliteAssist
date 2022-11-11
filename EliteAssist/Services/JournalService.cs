using EliteAssist.Config;
using EliteJournalReader;
using System.Collections.Generic;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace EliteAssist.Services
{
    public interface IJournalService
    {

    }

    internal class JournalService : WebSocketService, IJournalService
    {
        private JournalWatcher JournalWatcher;

        public JournalService() : base()
        {
            JournalWatcher = new JournalWatcher(GameInfo.StandardDirectory.FullName);
            JournalWatcher.AllEventHandler += HandleJournalEvents;
            JournalWatcher.StartWatching().Wait();
        }

        public override string Resource { get => "/journal"; }

        public void HandleJournalEvents(object sender, JournalEventArgs e)
        {
            var eventName = ((JournalEventArgs)e).OriginalEvent.Value<string>("event");

            if (!string.IsNullOrWhiteSpace(eventName))
            {
                Logger.Info($"journal event received: {eventName}");
            }
        }

        public void Replay()
        {
            JournalWatcher.ProcessPreviousJournals();
        }
    }
}
