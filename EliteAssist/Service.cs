using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace EliteAssist
{
    internal abstract class Service<T>
        where T : Service<T>, new()
    {
        private class WebSocketService : WebSocketBehavior
        {
            protected override void OnMessage(MessageEventArgs e)
            {
                if (e != null && e.Data != null)
                {
                    HandleClientRequest(Utils.DeserializeJSON<ClientRequest>(e.Data));
                }
            }
            public void SendMessage(string message)
            {
                Send(message);
            }
        }
        
        protected static readonly NLog.Logger Logger = LogManager.GetCurrentClassLogger();
        private static T instance = null;
        private WebSocketService _WebSocketService = null;

        protected static T GetInstance()
        {
            if (instance == null)
            {
                instance = new T();
            }
            return instance;
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

        protected virtual void _Initialize(WebSocketServer webSocketServer)
        {
            webSocketServer.AddWebSocketService<WebSocketService>(Resource, s =>
            {
                _WebSocketService = s;
            });
        }

        protected abstract void _HandleClientRequest(ClientRequest request);

        protected static void HandleClientRequest(ClientRequest request)
        {
            Logger.Info($"journal client request: {request}");
            GetInstance()._HandleClientRequest(request);
        }

        public abstract string Resource { get; }

        public static void Initialize(WebSocketServer webSocketServer)
        {
            GetInstance()._Initialize(webSocketServer);
        }
    }
}


// Service Template
//using System.Collections.Generic;
//using WebSocketSharp;
//using WebSocketSharp.Server;

//namespace EliteAssist
//{
//    internal class MyService : Service<MyService>
//    {
//        protected override void _Initialize(WebSocketServer webSocketServer)
//        {
//            base._Initialize(webSocketServer);
//        }

//        public override string Resource { get => "/someresource"; }

//        protected override void _HandleClientRequest(ClientRequest request)
//        {
//        }

//        public static void SomeCommand(List<string> qargs)
//        {
//        }
//    }
//}
