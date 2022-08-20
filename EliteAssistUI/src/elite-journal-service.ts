import { singleton } from 'tsyringe';

export class EliteJournalEvent {
  constructor(public name: string,
              public eventJSON: string) {}
}

type EliteJournalEventHandler = (event: EliteJournalEvent) => void;


@singleton()
export class EliteJournalService {
  private handlers: Array<EliteJournalEventHandler>;
  private wsStatus: WebSocket;
  private retrying = false;

  constructor() {
    console.log('EliteJournalService created');
    this.handlers = [];
    this.connect();
  }

  private connect(): void {
    console.log('connecting to service');
    this.wsStatus = new WebSocket("ws://localhost:5556/journal");
    this.wsStatus.onmessage = (event: MessageEvent) => this.handleJournalEvent(event);
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
  }

  private connectionClosed(): void {
    console.log('connection closed');
    this.retryConnection();
  }

  private connectionError(event: Event): void {
    console.log('connection error: ', event)
    this.retryConnection();
  }

  private handleJournalEvent(event: MessageEvent): void {
    const statusEvent = new EliteJournalEvent('update', event.data);
    this.handlers.forEach((handler) => handler(statusEvent));
  }

  subscribe(handler: EliteJournalEventHandler): void {
    this.handlers.push(handler);
  }

  unsubscribe(handler: EliteJournalEventHandler): void {
    const index = this.handlers.indexOf(handler);
    if (index >= 0) {
      this.handlers.splice(index, 1);
    }
  }
}
