using WebSocketSharp.Server;
using NLog;
using TypeGen.Core.TypeAnnotations;

namespace EliteAssist.Services
{
    [ExportTsClass]
    public class ActionDef
    {
        public string Name { get; set; }
    }

    public class ActionService : WebSocketService
    {
        public override string Resource { get => "/action"; }

        public ActionService() : base() { }

        [Method("list")]
        public void listActions()
        {
            Logger.Debug("list actions");
        }

        [Method("create", typeof(ActionDef))]
        public void createSome(ActionDef action)
        {
            Logger.Debug($"create action {action.Name}", action);
        }
    }
}
