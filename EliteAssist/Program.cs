using NLog;
using NLog.Config;
using NLog.Targets;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;
using EliteAssist.Services;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using EliteAssist.Database;
using EliteAssist.Config;

namespace EliteAssist
{
    internal class Program
    {
        public static string APPLICATION_DATA
        {
            get => Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                System.Reflection.Assembly.GetExecutingAssembly().GetName().Name
            );
        }

        private static readonly NLog.Logger Logger = LogManager.GetCurrentClassLogger();

        private static async Task Main(string[] args)
        {
            var nlogConfig = new LoggingConfiguration();

            nlogConfig.AddRule(minLevel: NLog.LogLevel.Trace, maxLevel: NLog.LogLevel.Fatal,
                target: new ConsoleTarget("consoleTarget")
                {
                    Layout = "${longdate} ${level}: ${message}"
                });

            LogManager.Configuration = nlogConfig;

            Logger.Info("EliteAssist launching");

            if (!Directory.Exists(APPLICATION_DATA))
            {
                Directory.CreateDirectory(APPLICATION_DATA);
            }

            var builder = Host.CreateDefaultBuilder();
            builder.ConfigureServices(services =>
                services.AddSingleton<IDatabase, DatabaseManager>()
                        .AddSingleton<IConfig, ConfigManager>()
                        .AddHostedService<SystemService>()
                        .AddHostedService<ActionService>()
                        .AddHostedService<BackpackService>()
                        .AddHostedService<CargoService>()
                        .AddHostedService<DashboardService>()
                        .AddHostedService<HotKeyService>()
                        .AddHostedService<JournalService>()
                        .AddHostedService<MarketService>()
                        .AddHostedService<NavigationService>()
                        .AddHostedService<ShipLockerService>()
                        .AddHostedService<StatusService>());
            var host = builder.Build();
            await host.RunAsync();
        }
    }
}