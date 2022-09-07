using NLog;
using System;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace EliteAssist
{
    internal abstract class Service
    {
        protected class WebSocketService : WebSocketBehavior
        {
            public Service Service { get; set; }

            protected override void OnMessage(MessageEventArgs e)
            {
                if (e != null && e.Data != null)
                {
                    Service.HandleClientRequest(Utils.DeserializeJSON<ClientRequest>(e.Data));
                }
            }
            public void SendMessage(string message)
            {
                Send(message);
            }
        }
        
        protected static readonly NLog.Logger Logger = LogManager.GetCurrentClassLogger();
        protected WebSocketService _WebSocketService = null;

        public Service(WebSocketServer webSocketServer)
        {
            Logger.Info($"Initializing {this.GetType().Name}");
            webSocketServer.AddWebSocketService<WebSocketService>(Resource, s =>
            {
                _WebSocketService = s;
                s.Service = this;
            });
        }

        protected void SendClientMessage(object message)
        {
            if (_WebSocketService != null)
            {
                string json = Utils.SerializeJSON(message);
                Logger.Info("sending event");
                Logger.Debug(json);
                _WebSocketService.SendMessage(json);
            }
        }

        protected virtual void HandleClientRequest(ClientRequest request)
        {
            Logger.Info($"{GetType().Name} client request: {request}");
        }

        public abstract string Resource { get; }
    }
}
