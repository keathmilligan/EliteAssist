using Jint;
using NLog;
using NLog.Config;
using NLog.Targets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace EliteAssist
{
    delegate void CommandHandler(List<string> args);

    internal class Program
    {
        private static readonly NLog.Logger Logger = LogManager.GetCurrentClassLogger();
        private static StatusService StatusService;
        private static JournalService JournalService;
        private static BackPackService BackPackService;
        private static CargoService CargoService;
        private static NavigationService NavigationService;
        private static ShipLockerService ShipLockerService;
        private static ActionsService ActionsService;
        private static HotKeysService HotKeysService;
        private static DashboardService DashboardService;

        private static void ShowHelp()
        {
            Console.WriteLine(@"
EliteAssist commands:

status      Refresh status info
journal     Replay session journal events
backpack    Refresh backpack info
cargo       Refresh cargo info
navigation  Refresh navigation info
shiplocker  Refresh ship locker info
help        Show this help message
quit        Exit the program

Commands may be abbreviated - the first matching command will be executed.
(e.g. ""st"" for status)");
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
            Logger.Debug($"journalPath: {journalPath}");

            KeyBindings.GetKeyBindings();

            var wssv = new WebSocketServer("ws://localhost:5556");

            BackPackService = new BackPackService(wssv);
            CargoService = new CargoService(wssv);
            JournalService = new JournalService(wssv);
            NavigationService = new NavigationService(wssv);
            ShipLockerService = new ShipLockerService(wssv);
            StatusService = new StatusService(wssv);
            ActionsService = new ActionsService(wssv);
            HotKeysService = new HotKeysService(wssv);
            DashboardService = new DashboardService(wssv);

            wssv.Start();

            var engine = new Engine(cfg => cfg.AllowClr());
            engine.SetValue("backpack", BackPackService);
            engine.SetValue("cargo", CargoService);
            engine.SetValue("journal", JournalService);
            engine.SetValue("navigation", NavigationService);
            engine.SetValue("shipLocker", ShipLockerService);
            engine.SetValue("status", StatusService);
            engine.SetValue("actions", ActionsService);
            engine.SetValue("hotkeys", HotKeysService);
            engine.SetValue("dashboard", DashboardService);

            var commands = new Dictionary<string, CommandHandler>
            {
                {"status", (a) => { StatusService.Refresh(); }},
                {"journal", (a) => { JournalService.Replay(); }},
                {"backpack", (a) => { BackPackService.Refresh(); }},
                {"cargo", (a) => { CargoService.Refresh(); }},
                {"navigation", (a) => { NavigationService.Refresh(); }},
                {"shiplocker", (a) => { ShipLockerService.Refresh(); }},
                {"help", (a) => { ShowHelp(); }},
                {"quit", null }
            };

            while (true)
            {
                Console.Write("> ");
                string input = Console.ReadLine();
                string command = input.Split(' ')[0].ToLower();
                var qargs = Regex.Matches(input, @"[\""].+?[\""]|[^ ]+")
                    .Cast<Match>()
                    .Select(m => m.Value)
                    .ToList();
                string match = null;
                CommandHandler handler = null;
                foreach (KeyValuePair<string, CommandHandler> c in commands)
                {
                    int len = command.Length;
                    if (String.Compare(command, 0, c.Key, 0, len) == 0)
                    {
                        match = c.Key;
                        handler = c.Value;
                        break;
                    }
                }
                if (match != null)
                {
                    Logger.Info($"executing {match} command");
                    if (match == "quit")
                    {
                        break;
                    }
                    else
                    {
                        handler(qargs);
                    }
                }
                else
                {
                    try
                    {
                        var result = engine.Evaluate(input);
                        Console.WriteLine(result.ToObject());
                    }
                    catch(Exception err)
                    {
                        Logger.Error(err);
                    }
                }
            }

            wssv.Stop();
        }
    }
}
