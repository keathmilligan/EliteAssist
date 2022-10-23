using Microsoft.Data.Sqlite;
using NLog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace EliteAssist.Database
{
    public interface IDatabase
    {

    }

    [System.ComponentModel.DesignerCategory("Code")]
    internal class DatabaseConnection : SqliteConnection
    {
        public DatabaseConnection(string databasePath) : base($"Data Source={databasePath}") { }

        public int Execute(string sql)
        {
            using (var command = CreateCommand())
            {
                command.CommandText = sql;
                return command.ExecuteNonQuery();
            }
        }

        public SqliteDataReader Query(string sql)
        {
            var command = CreateCommand();
            command.CommandText = sql;
            return command.ExecuteReader();
        }
    }

    [System.ComponentModel.DesignerCategory("Code")]
    internal class DatabaseManager : IDatabase
    {
        private static readonly NLog.Logger Logger = LogManager.GetCurrentClassLogger();
        private static string DATABASE_PATH
        {
            get => Path.Combine(Program.APPLICATION_DATA, "elite-assist.db");
        }

        public DatabaseManager()
        {
            Logger.Info("starting database manager service");
            if (!File.Exists(DATABASE_PATH))
            {
                // Create blank database
                Logger.Info($"creating {DATABASE_PATH}");
                File.Create(DATABASE_PATH).Dispose();
                ExecuteSqlFile("schema.sql3");
            }

            // Apply any necessary migrations
            ApplyMigrations();
        }

        public DatabaseConnection GetConnection()
        {
            var connection = new DatabaseConnection(DATABASE_PATH);
            connection.Open();
            return connection;
        }

        public int ExecuteSqlFile(string script, DatabaseConnection db)
        {
            var sqlPath = Path.Combine(Assembly.GetExecutingAssembly().Location, script);
            if (!File.Exists(sqlPath))
            {
                sqlPath = Path.Combine(".", "Database", script);
            }
            Logger.Debug($"cwd = {Directory.GetCurrentDirectory()}");
            Logger.Debug($"executing: {sqlPath}");
            var sql = File.ReadAllText(sqlPath);
            var result = db.Execute(sql);
            Logger.Debug($"result: {result}");
            return result;
        }

        public int ExecuteSqlFile(string script)
        {
            using (var db = GetConnection())
            {
                return ExecuteSqlFile(script, db);
            }
        }

        private void ApplyMigrations()
        {
            var appliedMigrations = new List<string>();
            using (var db = GetConnection())
            {
                using (var query = db.Query("SELECT name FROM migrations"))
                {
                    while (query.Read())
                    {
                        appliedMigrations.Add(query.GetString(0));
                    }
                }

                var migrationsPath = Path.Combine(Assembly.GetExecutingAssembly().Location, "Migrations");
                if (!Directory.Exists(migrationsPath))
                {
                    migrationsPath = Path.Combine(".", "Database", "Migrations");
                }
                Logger.Info($"applying database migrations - path: {migrationsPath}");
                foreach (string migration in Directory.EnumerateFiles(migrationsPath)
                            .Select(m => Path.GetFileName(m))
                            .OrderBy(m => m))
                {
                    if (!appliedMigrations.Contains(migration))
                    {
                        Logger.Info($"applying migration: {migration}");
                        var timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
                        ExecuteSqlFile(Path.Combine("Migrations", migration));
                        db.Execute($"INSERT INTO migrations(name, timestamp) VALUES('{migration}', '{timestamp}')");
                    }
                }
            }
        }
    }
}
