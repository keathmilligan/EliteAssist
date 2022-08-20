import { singleton } from 'tsyringe';
import { ClientRequest } from './client-request';

export class EliteStatusEvent {
  constructor(public name: string,
              public statusJSON: string) {}
}

type EliteStatusEventHandler = (event: EliteStatusEvent) => void;


@singleton()
export class EliteStatusService {
  private handlers: Array<EliteStatusEventHandler>;
  private wsStatus: WebSocket;
  private statusJSON: string;
  private retrying = false;

  constructor() {
    console.log('EliteStatusService created');
    this.handlers = [];
    this.connect();
  }

  private connect(): void {
    console.log('connecting to service');
    this.wsStatus = new WebSocket("ws://localhost:5556/status");
    this.wsStatus.onmessage = (event: MessageEvent) => this.updateStatus(event);
    this.wsStatus.onopen = () => this.connectionOpened();
    this.wsStatus.onclose = () => this.connectionClosed();
    this.wsStatus.onerror = (event: Event) => this.connectionError(event);
  }

  private retryConnection(): void {
    if (!this.retrying) {
      this.retrying = true;
      setTimeout(() => {
        console.log('retrying connection');
        this.retrying = false;
        this.connect();
      }, 5000);
    }
  }

  private connectionOpened(): void {
    console.log('connection opened');
    this.requestUpdate();
  }

  private connectionClosed(): void {
    console.log('connection closed');
    this.retryConnection();
  }

  private connectionError(event: Event): void {
    console.log('connection error: ', event)
    this.retryConnection();
  }

  private updateStatus(event: MessageEvent): void {
    this.statusJSON = event.data;
    const statusEvent = new EliteStatusEvent('update', event.data);
    this.handlers.forEach((handler) => handler(statusEvent));
  }

  subscribe(handler: EliteStatusEventHandler): void {
    this.handlers.push(handler);
  }

  unsubscribe(handler: EliteStatusEventHandler): void {
    const index = this.handlers.indexOf(handler);
    if (index >= 0) {
      this.handlers.splice(index, 1);
    }
  }

  requestUpdate(): void {
    const request = new ClientRequest('GET', null, null);
    this.wsStatus.send(JSON.stringify(request));
  }
}
