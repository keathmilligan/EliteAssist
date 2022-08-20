using EliteJournalReader;
using EliteJournalReader.Events;
using NLog;
using NLog.Config;
using NLog.Targets;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace EliteAssist
{
    public class EchoService : WebSocketBehavior
    {
        private static readonly NLog.Logger Logger = LogManager.GetCurrentClassLogger();

        protected override void OnMessage(MessageEventArgs e)
        {
            var msg = e.Data;
            Logger.Info($"MSG: {msg}");
            Send(msg);
        }
    }

    internal class Program
    {
        private static readonly NLog.Logger Logger = LogManager.GetCurrentClassLogger();
        public static CargoWatcher CargoWatcher;

        public static void HandleCargoEvents(object sender, CargoEvent.CargoEventArgs evt)
        {
            if (evt.OriginalEvent != null)
            {
                Logger.Debug($"cargo event: {evt.ToString()}");
                EliteData.HandleCargoEvents(sender, evt);
            }
            else
            {
                Logger.Debug("null CargoEvent.CargoEventArgs received");
            }
        }

        static void Main(string[] args)
        {
            var nlogConfig = new LoggingConfiguration();

            nlogConfig.AddRule(minLevel: NLog.LogLevel.Trace, maxLevel: NLog.LogLevel.Fatal,
                target: new ConsoleTarget("consoleTarget")
                {
                    Layout = "${longdate} ${level}: ${message}"
                });

            LogManager.Configuration = nlogConfig;

            Logger.Info("elite-macro");

            var journalPath = GameInfo.StandardDirectory.FullName;
            KeyBindings.GetKeyBindings();
            Logger.Debug($"journalPath: {journalPath}");
            var defaultFilter = @"Journal.*.log";
            CargoWatcher = new CargoWatcher(journalPath);
            CargoWatcher.CargoUpdated += HandleCargoEvents;

            var wssv = new WebSocketServer("ws://localhost:5556");
            wssv.AddWebSocketService<EchoService>("/echo");

            StatusService.Initialize(wssv);
            JournalService.Initialize(wssv);

            wssv.Start();

            CargoWatcher.StartWatching();

            while (true)
            {
                string input = Console.ReadLine();
                string command = input.Split(' ')[0].ToLower();
                var qargs = Regex.Matches(input, @"[\""].+?[\""]|[^ ]+")
                    .Cast<Match>()
                    .Select(m => m.Value)
                    .ToList();

                // q)uit
                if (command.StartsWith("q"))
                {
                    break;
                }

                // j)ournal
                else if (command.StartsWith("j"))
                {
                    JournalService.Replay(qargs);
                }

                // s)tatus
                else if (command.StartsWith("s"))
                {
                    StatusService.Refresh(qargs);
                }
            }

            wssv.Stop();
        }
    }
}
