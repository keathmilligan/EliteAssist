import "reflect-metadata";

class ClientRequest {
  method: string;
  body: unknown;
}

export abstract class Service {
  private retrying: boolean;
  protected ws: WebSocket;

  constructor(
    private readonly name: string,
    private readonly resource: string
  ) {
    console.log(`starting service ${this.name} with resource ${this.resource}`);
    this.connect();
  }

  protected connect(): void {
    const url = `ws://localhost:5556/${this.resource}`;
    console.log(`connecting to ${url}`)
    this.ws = new WebSocket(url);
    this.ws.onmessage = (event: MessageEvent) => this.handleMessage(JSON.parse(event.data));
    this.ws.onopen = () => this.connectionOpened();
    this.ws.onclose = () => this.connectionClosed();
    this.ws.onerror = (event: Event) => this.connectionError(event);
  }

  protected retryConnection(): void {
    if (!this.retrying) {
      this.retrying = true;
      setTimeout(() => {
        console.log('retrying connection');
        this.retrying = false;
        this.connect();
      }, 15000);
    }
  }

  protected connectionOpened(): void {
    console.log('connection opened');
  }

  protected connectionClosed(): void {
    console.log('connection closed');
    this.retryConnection();
  }

  protected connectionError(event: Event): void {
    console.log('connection error: ', event)
    this.retryConnection();
  }

  protected send(method: string, body: unknown=null): void {
    this.ws.send(JSON.stringify({method: method, body: body}));
  }
  
  public handleMessage(request: ClientRequest): void {
    console.log(`received: ${request.method}: ${request.body}`)
    const routes: Map<string, (service:Service, body:unknown) => void> = Reflect.getMetadata("routes", this);
    if (routes.has(request.method)) {
      const func: (service:Service, body:unknown) => void =  routes.get(request.method);
      func.call(this, request.body);
    }
  }
}

export function method(name: string) {
  return function(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(`method ${name}: ${propertyKey}`);
    let routes: Map<string, unknown>;
    if (!Reflect.hasMetadata("routes", target)) {
      routes = new Map();
      Reflect.defineMetadata("routes", routes, target);
    } else {
      routes = Reflect.getMetadata("routes", target);
    }
    routes.set(name, descriptor.value);
    Reflect.defineMetadata("method", name, target, propertyKey);
  };
}
