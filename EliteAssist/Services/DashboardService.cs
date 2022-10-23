using WebSocketSharp.Server;
using NLog;
using TypeGen.Core.TypeAnnotations;
using EliteAssist.Config;

namespace EliteAssist.Services
{
    public class DashboardService : WebSocketService
    {
        private IConfig Config;

        public DashboardService(IConfig config) : base() => Config = config;

        public override string Resource { get => "/dashboard"; }

        [Method("list")]
        public void listDashboards()
        {
            Logger.Debug("list dashboards");
        }

        [Method("create", typeof(Dashboard))]
        public void createDashboard(Dashboard dashboard)
        {
            Logger.Debug($"create dashboard {dashboard.Name}", dashboard);
        }

        [Method("update", typeof(Dashboard))]
        public void updateDashboard(Dashboard dashboard)
        {
            Logger.Debug($"update dashboard {dashboard.Name}");
        }

        [Method("delete", typeof(string))]
        public void deleteDashboard(string name)
        {
            Logger.Debug($"delete dashboard {name}");
        }
    }
}
