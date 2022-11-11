using Newtonsoft.Json;
using NLog;
using System;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace EliteAssist.Services
{
    [System.AttributeUsage(System.AttributeTargets.Method)]
    public class Method : System.Attribute
    {
        private string method;
        private Type type;

        public Method(string method)
        {
            this.method = method;
            this.type = null;
        }

        public Method(string method, Type type)
        {
            this.method = method;
            this.type = type;
        }

        public string GetMethod()
        {
            return this.method;
        }

        public Type GetArgType()
        {
            return this.type;
        }
    }

    public class ClientRequest
    {
        public string Method { get; set; }

        [JsonConverter(typeof(ObjectTostringConverter))]
        public string Body { get; set; }
    }

    internal class ClientRequestOut
    {
        public string Method { get; set; }
        public string Body { get; set; }
    }

    internal class StaticConfig
    {
        internal static WebSocketServer WebSocketServer = null;
    }

    internal class WebSocket : WebSocketBehavior
    {
        public event EventHandler<ClientRequest> ClientRequestReceived;
        
        protected override void OnMessage(MessageEventArgs e)
        {
            if (e != null && e.Data != null)
            {
                var request = Utils.DeserializeJSON<ClientRequest>(e.Data);
                ClientRequestReceived?.Invoke(this, request);
            }
        }

        public void SendMessage(string message)
        {
            Send(message);
        }
    }

    public abstract class WebSocketService // : BackgroundService
    {
        protected static readonly NLog.Logger Logger = LogManager.GetCurrentClassLogger();
        public abstract string Resource { get; }
        private WebSocket WebSocket;

        public WebSocketService()
        {
            Logger.Info($"starting {GetType().Name} @ {Resource}");
            if (StaticConfig.WebSocketServer == null)
            {
                StaticConfig.WebSocketServer = new WebSocketServer("ws://localhost:5556");
                StaticConfig.WebSocketServer.Start();
            }
            StaticConfig.WebSocketServer.AddWebSocketService<WebSocket>(Resource, ws =>
            {
                ws.ClientRequestReceived += HandleRequest;
                WebSocket = ws;
            });
        }

        public void HandleRequest(object sender, ClientRequest request)
        {
            Logger.Info($"{GetType().Name} client request: {request}");
            bool handled = false;
            foreach (var methodInfo in this.GetType().GetMethods())
            {
                foreach (var attr in System.Attribute.GetCustomAttributes(methodInfo))
                {
                    if (attr is Method)
                    {
                        Method method = attr as Method;
                        if (method.GetMethod() == request.Method)
                        {
                            if (request.Body != null)
                            {
                                methodInfo.Invoke(this, new[] { Utils.DeserializeObject(request.Body, method.GetArgType()) });
                            }
                            else
                            {
                                methodInfo.Invoke(this, null);
                            }
                            handled = true;
                            break;
                        }
                    }
                }
                if (handled)
                {
                    break;
                }
            }
        }

        protected void SendClientMessage(string method, object payload)
        {
            if (WebSocket != null)
            {
                var request = new ClientRequestOut
                {
                    Method = method,
                    Body = Utils.SerializeJSON(payload)
                };
                string json = Utils.SerializeJSON(request);
                Logger.Info("sending event");
                Logger.Debug(json);
                WebSocket.SendMessage(json);
            }
        }

        //protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        //{
        //    while (!stoppingToken.IsCancellationRequested)
        //    {
        //        await Task.Delay(1000, stoppingToken);
        //    }
        //}
    }
}
