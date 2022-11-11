using NLog;
using EliteAssist.Config;
using System.Collections.Generic;
using System;
using EliteAssist.Database;

namespace EliteAssist.Services
{
    public interface IDashboardService
    {
        void CreateDashboard(Dashboard dashboard);
        void UpdateDashboard(Dashboard dashboard);
        void DeleteDashboard(long id);
        List<Dashboard> ListDashboards();
        event EventHandler<Dashboard> DashboardCreated;
        event EventHandler<Dashboard> DashboardUpdated;
        event EventHandler<Dashboard> DashboardDeleted;
    }

    public class DashboardService : WebSocketService, IDashboardService
    {
        private IConfig Config;
        private IDatabase Database;
        public event EventHandler<Dashboard> DashboardCreated;
        public event EventHandler<Dashboard> DashboardUpdated;
        public event EventHandler<Dashboard> DashboardDeleted;

        public DashboardService(IConfig config, IDatabase database) : base()
        {
            Config = config;
            Database = database;
            CreateDefaultDashboard();
        }

        private void CreateDefaultDashboard()
        {
            var dashboards = new List<Dashboard>();
            using (var db = Database.GetConnection())
            {
                using (var query = db.Query("SELECT name FROM dashboards"))
                {
                    if (!query.HasRows)
                    {
                        Logger.Debug("creating default dashboard");
                        CreateDashboard(new Dashboard
                        {
                            Name = "Default Dashboard",
                            Overlay = true,
                            ClickThrough = false,
                            Titlebar = true
                        });
                    }
                }
            }
        }

        public override string Resource { get => "/dashboard"; }

        [Method("list")]
        public void ListDashboardsRequest()
        {
            Logger.Debug("list dashboards");
            this.SendClientMessage("list", ListDashboards());
        }

        public List<Dashboard> ListDashboards()
        {
            var dashboards = new List<Dashboard>();
            using (var db = Database.GetConnection())
            {
                using (var query = db.Query("SELECT * FROM dashboards"))
                {
                    while (query.Read())
                    {
                        var dashboard = new Dashboard
                        {
                            Id = query.GetInt64(0),
                            Name = query.GetString(1),
                            Overlay = query.GetBoolean(2),
                            ClickThrough = query.GetBoolean(3),
                            Titlebar = query.GetBoolean(4),
                        };
                        dashboards.Add(dashboard);
                    }
                }
            }
            return dashboards;
        }

        [Method("create", typeof(Dashboard))]
        public void CreateDashboard(Dashboard dashboard)
        {
            using (var db = Database.GetConnection())
            {
                var command = db.CreateCommand();
                command.CommandText = @"INSERT INTO dashboards(name, overlay, click_through, titlebar)
                                        VALUES($name, $overlay, $click_through, $titlebar)";
                command.Parameters.AddWithValue("$name", dashboard.Name);
                command.Parameters.AddWithValue("$overlay", dashboard.Overlay);
                command.Parameters.AddWithValue("$click_through", dashboard.ClickThrough);
                command.Parameters.AddWithValue("$titlebar", dashboard.Titlebar);
                var result = command.ExecuteNonQuery();
                if (result > 0)
                {
                    Logger.Info($"new dashboard created {dashboard.Id}: {dashboard.Name}");
                    var lastId = db.ExecuteScalar("SELECT last_insert_rowid()");
                    using (var query = db.Query($"SELECT * FROM dashboards WHERE id = {lastId}"))
                    {
                        if (query.HasRows)
                        {
                            query.Read();
                            this.DashboardCreated.Invoke(this, new Dashboard
                            {
                                Id = query.GetInt64(0),
                                Name = query.GetString(1),
                                Overlay = query.GetBoolean(2),
                                ClickThrough = query.GetBoolean(3),
                                Titlebar = query.GetBoolean(4)
                            });
                        }
                        else
                        {
                            Logger.Error($"no result returned for dashboard {lastId}");
                        }
                    }
                }
                else
                {
                    Logger.Error($"insert returned error {result}");
                }
            }
        }

        [Method("update", typeof(Dashboard))]
        public void UpdateDashboard(Dashboard dashboard)
        {
            using (var db = Database.GetConnection())
            {
                var command = db.CreateCommand();
                command.CommandText = @"UPDATE dashboards
                                        SET(name, overlay, click_through, titlebar) =
                                            ($name, $overlay, $click_through, $titlebar)
                                        FROM dashboards
                                        WHERE dashboards.id = $id";
                command.Parameters.AddWithValue("$name", dashboard.Name);
                command.Parameters.AddWithValue("$overlay", dashboard.Overlay);
                command.Parameters.AddWithValue("$click_through", dashboard.ClickThrough);
                command.Parameters.AddWithValue("$titlebar", dashboard.Titlebar);
                command.Parameters.AddWithValue("$id", dashboard.Id);
                var result = command.ExecuteNonQuery();
                if (result > 0)
                {
                    Logger.Info($"dashboard updated {dashboard.Id}: {dashboard.Name}");
                    using (var query = db.Query($"SELECT * FROM dashboards WHERE id = {dashboard.Id}"))
                    {
                        if (query.HasRows)
                        {
                            query.Read();
                            this.DashboardUpdated.Invoke(this, new Dashboard
                            {
                                Id = query.GetInt64(0),
                                Name = query.GetString(1),
                                Overlay = query.GetBoolean(2),
                                ClickThrough = query.GetBoolean(3),
                                Titlebar = query.GetBoolean(4)
                            });
                        }
                        else
                        {
                            Logger.Error($"no result returned for dashboard {dashboard.Id}");
                        }
                    }
                }
                else
                {
                    Logger.Error($"update returned error {result}");
                }
            }
        }

        [Method("delete", typeof(string))]
        public void DeleteDashboard(long id)
        {
            using (var db = Database.GetConnection())
            {
                Dashboard dashboard;
                using (var query = db.Query($"SELECT * FROM dashboards WHERE id = {id}"))
                {
                    if (query.HasRows)
                    {
                        query.Read();
                        dashboard = new Dashboard
                        {
                            Id = query.GetInt64(0),
                            Name = query.GetString(1),
                            Overlay = query.GetBoolean(2),
                            ClickThrough = query.GetBoolean(3),
                            Titlebar = query.GetBoolean(4)
                        };
                    }
                    else
                    {
                        Logger.Error($"no result returned for dashboard {id}");
                        return;
                    }
                }

                var result = db.Execute($"DELETE FROM dashboards WHERE dashboards.id = {id}");
                if (result > 0)
                {
                    Logger.Info($"dashboard deleted {id}");
                    this.DashboardDeleted.Invoke(this, dashboard);
                }
                else
                {
                    Logger.Error($"delete returned error {result}");
                }
            }
        }
    }
}
