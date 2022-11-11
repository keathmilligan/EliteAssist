using EliteAssist.Database;
using NLog;

namespace EliteAssist.Config
{
    public interface IConfig
    {
    }

    internal class ConfigManager : IConfig
    {
        private static readonly NLog.Logger Logger = LogManager.GetCurrentClassLogger();
        private IDatabase Database;

        public ConfigManager(IDatabase database)
        {
            Logger.Info("ConfigManager starting");
            Database = database;
            KeyBindings.GetKeyBindings();
        }
    }
}
