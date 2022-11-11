using Microsoft.Data.Sqlite;
using NLog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace EliteAssist.Database
{
    public interface IDatabase
    {
        DatabaseConnection GetConnection();
        int ExecuteSqlFile(string script, DatabaseConnection db);
        int ExecuteSqlFile(string script);
    }

    [System.ComponentModel.DesignerCategory("Code")]
    public class DatabaseConnection : SqliteConnection
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

        public object ExecuteScalar(string sql)
        {
            using (var command = CreateCommand())
            {
                command.CommandText = sql;
                return command.ExecuteScalar();
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
        private static string DATABASE_FILENAME = "elite-assist.db";
        private string DataDir;
        private string DatabasePath;

        public DatabaseManager()
        {
            var localDB = Path.Combine(Directory.GetCurrentDirectory(), "Database");
            DataDir = Directory.Exists(localDB) ? localDB : Program.APPLICATION_DATA;
            DatabasePath = Path.Combine(DataDir, DATABASE_FILENAME);
            Logger.Info($"starting database manager service - {DatabasePath}");
            if (!File.Exists(DatabasePath))
            {
                // Create blank database
                Logger.Info($"creating {DatabasePath}");
                File.Create(DatabasePath).Dispose();
                ExecuteSqlFile("schema.sql3");
            }

            // Apply any necessary migrations
            ApplyMigrations();
        }

        public DatabaseConnection GetConnection()
        {
            var connection = new DatabaseConnection(DatabasePath);
            connection.Open();
            return connection;
        }

        public int ExecuteSqlFile(string script, DatabaseConnection db)
        {
            var sqlPath = Path.Combine(DataDir, script);
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

                var migrationsPath = Path.Combine(DataDir, "Migrations");
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
