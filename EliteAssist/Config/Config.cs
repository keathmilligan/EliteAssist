using EliteAssist.Database;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
