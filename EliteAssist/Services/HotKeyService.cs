using WebSocketSharp.Server;
using NLog;
using TypeGen.Core.TypeAnnotations;

namespace EliteAssist.Services
{
    [ExportTsClass]
    public class HotKeyDef
    {
        public string Name { get; set; }
    }

    internal class HotKeyService : WebSocketService
    {
        public HotKeyService() : base()
        {
        }

        public override string Resource { get => "/hotkey"; }

        [Method("list")]
        public void listHotKeys()
        {
            Logger.Debug("list hotkeys");
        }

        [Method("create", typeof(HotKeyDef))]
        public void createHotKey(HotKeyDef hotkey)
        {
            Logger.Debug($"create hotkey {hotkey.Name}", hotkey);
        }
    }
}
