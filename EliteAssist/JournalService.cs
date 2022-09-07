using EliteJournalReader;
using System.Collections.Generic;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace EliteAssist
{
    internal class JournalService : Service
    {
        private JournalWatcher JournalWatcher;

        public JournalService(WebSocketServer webSocketServer) : base(webSocketServer)
        {
            JournalWatcher = new JournalWatcher(GameInfo.StandardDirectory.FullName);
            JournalWatcher.AllEventHandler += HandleJournalEvents;
            JournalWatcher.StartWatching().Wait();
        }

        public override string Resource { get => "/journal"; }

        protected override void HandleClientRequest(ClientRequest request)
        {
        }

        public void HandleJournalEvents(object sender, JournalEventArgs e)
        {
            var eventName = ((JournalEventArgs)e).OriginalEvent.Value<string>("event");

            if (!string.IsNullOrWhiteSpace(eventName))
            {
                Logger.Info($"journal event received: {eventName}");
                SendClientMessage(e.OriginalEvent);
            }
        }

        public void Replay()
        {
            JournalWatcher.ProcessPreviousJournals();
        }
    }
}
