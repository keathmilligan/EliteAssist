using NLog;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace EliteAssist
{
    public class KeyBindingFileEvent : EventArgs
    {
    }

    public class KeyBindingWatcher : FileSystemWatcher
    {
        public event EventHandler KeyBindingUpdated;

        protected KeyBindingWatcher()
        {
        }

        public KeyBindingWatcher(string path, string fileName)
        {
            Filter = fileName;
            NotifyFilter = NotifyFilters.CreationTime | NotifyFilters.LastWrite;
            Path = path;
        }

        public virtual void StartWatching()
        {
            if (EnableRaisingEvents)
            {
                return;
            }
            Changed -= UpdateStatus;
            Changed += UpdateStatus;
            EnableRaisingEvents = true;
        }

        public virtual void StopWatching()
        {
            try
            {
                if (EnableRaisingEvents)
                {
                    Changed -= UpdateStatus;
                    EnableRaisingEvents = false;
                }
            }
            catch (Exception e)
            {
                Trace.TraceError($"Error while stopping Status watcher: {e.Message}");
                Trace.TraceInformation(e.StackTrace);
            }
        }

        protected void UpdateStatus(object sender, FileSystemEventArgs e)
        {
            Thread.Sleep(50);
            KeyBindingUpdated?.Invoke(this, EventArgs.Empty);
        }
    }

    public class KeyBindings
    {
        public static KeyBindingWatcher KeyBindingWatcherStartPreset;
        public static FifoExecution keywatcherjob = new FifoExecution();
        public static KeyBindingWatcher[] KeyBindingWatcher = new KeyBindingWatcher[4];
        public static Dictionary<BindingType, UserBindings> Binding = new Dictionary<BindingType, UserBindings>();
        private static readonly NLog.Logger Logger = LogManager.GetCurrentClassLogger();

        public static void HandleKeyBindingEvents(object sender, object evt)
        {
            keywatcherjob.QueueUserWorkItem((threadContext) => GetKeyBindings(), null);
        }

        private static bool IsFileLocked(FileInfo file)
        {
            FileStream stream = null;

            try
            {
                stream = file.Open(FileMode.Open, FileAccess.Read, FileShare.None);
            }
            catch (IOException)
            {
                //the file is unavailable because it is:
                //still being written to
                //or being processed by another thread
                //or does not exist (has already been processed)
                return true;
            }
            finally
            {
                stream?.Close();
            }

            //file is not locked
            return false;
        }

        // copied from https://github.com/MagicMau/EliteJournalReader

        private static FileInfo FileInfo(string cargoPath)
        {
            try
            {
                var info = new FileInfo(cargoPath);
                if (info.Exists)
                {
                    // This info can be cached so force a refresh
                    info.Refresh();
                }
                return info;
            }
            catch { return null; }
        }

        // copied from https://github.com/MagicMau/EliteJournalReader
        public static string[] ReadStartPreset(string startPresetPath)
        {
            try
            {
                Thread.Sleep(100);

                FileInfo fileInfo = null;
                try
                {
                    fileInfo = FileInfo(startPresetPath);
                }
                catch (NotSupportedException)
                {
                    // do nothing
                }

                if (fileInfo != null)
                {
                    var maxTries = 6;
                    while (IsFileLocked(fileInfo))
                    {
                        Thread.Sleep(100);
                        maxTries--;
                        if (maxTries == 0)
                        {
                            return null;
                        }
                    }

                    using (var fs = new FileStream(fileInfo.FullName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                    using (var reader = new StreamReader(fs, Encoding.UTF8))
                    {
                        fs.Seek(0, SeekOrigin.Begin);
                        var bindsNames = reader.ReadToEnd();

                        if (string.IsNullOrEmpty(bindsNames))
                        {
                            return null;
                        }
                        return bindsNames.Split('\n');

                    }
                }
            }
            catch (Exception e)
            {
                Trace.TraceError($"unexpected error: {e.Message}");
                Trace.TraceInformation(e.StackTrace);
            }

            return null;
        }

        public static void HandleKeyBinding(BindingType bindingType, string bindingsPath, string bindsName)
        {
            Logger.Info("handle key binding " + bindsName);

            if (KeyBindingWatcher[(int)bindingType] != null)
            {
                KeyBindingWatcher[(int)bindingType].StopWatching();
                KeyBindingWatcher[(int)bindingType].Dispose();
                KeyBindingWatcher[(int)bindingType] = null;
            }

            var fileName = Path.Combine(bindingsPath, bindsName + ".4.0.binds");

            if (!File.Exists(fileName))
            {
                Logger.Error("file not found " + fileName);

                fileName = fileName.Replace(".4.0.binds", ".3.0.binds");

                if (!File.Exists(fileName))
                {
                    fileName = fileName.Replace(".3.0.binds", ".binds");

                    if (!File.Exists(fileName))
                    {
                        Logger.Error("file not found " + fileName);
                    }
                }
            }

            // steam
            if (!File.Exists(fileName))
            {
                bindingsPath = SteamPath.FindSteamEliteDirectory();

                if (!string.IsNullOrEmpty(bindingsPath))
                {
                    fileName = Path.Combine(bindingsPath, bindsName + ".4.0.binds");

                    if (!File.Exists(fileName))
                    {
                        Logger.Error("steam file not found " + fileName);

                        fileName = fileName.Replace(".4.0.binds", ".3.0.binds");

                        if (!File.Exists(fileName))
                        {
                            fileName = fileName.Replace(".3.0.binds", ".binds");

                            if (!File.Exists(fileName))
                            {
                                Logger.Error("steam file not found " + fileName);
                            }
                        }
                    }
                }
            }

            // epic
            if (!File.Exists(fileName))
            {
                bindingsPath = EpicPath.FindEpicEliteDirectory();

                if (!string.IsNullOrEmpty(bindingsPath))
                {
                    fileName = Path.Combine(bindingsPath, bindsName + ".4.0.binds");

                    if (!File.Exists(fileName))
                    {
                        Logger.Error("epic file not found " + fileName);

                        fileName = fileName.Replace(".4.0.binds", ".3.0.binds");

                        if (!File.Exists(fileName))
                        {
                            fileName = fileName.Replace(".3.0.binds", ".binds");

                            if (!File.Exists(fileName))
                            {
                                Logger.Error("epic file not found " + fileName);
                            }
                        }
                    }
                }
            }

            if (File.Exists(fileName))
            {
                var serializer = new XmlSerializer(typeof(UserBindings));

                //Logger.Instance.LogMessage(TracingLevel.INFO, "using " + fileName);

                var reader = new StreamReader(fileName);
                Binding[bindingType] = (UserBindings)serializer.Deserialize(reader);
                reader.Close();


                var keyBindingPath = Path.GetDirectoryName(fileName);
                Logger.Info("monitoring key binding path #2 " + keyBindingPath);
                var keyBindingFileName = Path.GetFileName(fileName);


                Logger.Info("monitoring key binding file name #2 " + keyBindingFileName);

                KeyBindingWatcher[(int)bindingType] = new KeyBindingWatcher(keyBindingPath, keyBindingFileName);
                KeyBindingWatcher[(int)bindingType].KeyBindingUpdated += HandleKeyBindingEvents;
                KeyBindingWatcher[(int)bindingType].StartWatching();
            }
            else
            {
                Logger.Error("file not found " + fileName);
            }
        }

        public static void GetKeyBindings()
        {
            if (KeyBindingWatcherStartPreset != null)
            {
                KeyBindingWatcherStartPreset.StopWatching();
                KeyBindingWatcherStartPreset.Dispose();
                KeyBindingWatcherStartPreset = null;
            }

            var bindingsPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Frontier Developments\Elite Dangerous\Options\Bindings");

            if (!Directory.Exists(bindingsPath))
            {
                Logger.Fatal($"Directory doesn't exist {bindingsPath}");
            }

            var startPresetPath = Path.Combine(bindingsPath, "StartPreset.4.start");

            if (!File.Exists(startPresetPath))
            {

                startPresetPath = Path.Combine(bindingsPath, "StartPreset.start");
            }

            //Logger.Instance.LogMessage(TracingLevel.INFO, "bindings path " + bindingsPath);

            var bindsNames = ReadStartPreset(startPresetPath);

            Logger.Info("key bindings " + string.Join(",", bindsNames));

            var keyBindingPath = Path.GetDirectoryName(startPresetPath);
            Logger.Info("monitoring key binding path #1 " + keyBindingPath);
            var keyBindingFileName = Path.GetFileName(startPresetPath);

            Logger.Info("monitoring key binding file name #1 " + keyBindingFileName);
            KeyBindingWatcherStartPreset = new KeyBindingWatcher(keyBindingPath, keyBindingFileName);
            KeyBindingWatcherStartPreset.KeyBindingUpdated += HandleKeyBindingEvents;
            KeyBindingWatcherStartPreset.StartWatching();

            if (bindsNames.Length == 4) // odyssey
            {
                Logger.Info("odyssey key bindings");

                HandleKeyBinding(BindingType.General, bindingsPath, bindsNames[0]);
                HandleKeyBinding(BindingType.Ship, bindingsPath, bindsNames[1]);
                HandleKeyBinding(BindingType.Srv, bindingsPath, bindsNames[2]);
                HandleKeyBinding(BindingType.OnFoot, bindingsPath, bindsNames[3]);
            }
            else // horizon
            {
                Logger.Info("horizon key bindings");

                HandleKeyBinding(BindingType.General, bindingsPath, bindsNames.First());
                HandleKeyBinding(BindingType.Ship, bindingsPath, bindsNames.First());
                HandleKeyBinding(BindingType.Srv, bindingsPath, bindsNames.First());
                HandleKeyBinding(BindingType.OnFoot, bindingsPath, bindsNames.First());
            }

        }
    }
}
