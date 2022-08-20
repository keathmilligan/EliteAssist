import React, { Component } from 'react';
import {container} from 'tsyringe';
import {EliteJournalService, EliteJournalEvent} from './elite-journal-service';

type JournalState = {
  json: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export class EliteJournal extends Component<{}, JournalState> {
  wsStatus: WebSocket;
  statusService: EliteJournalService;

  constructor(props: never) {
    super(props);
    this.statusService = container.resolve(EliteJournalService);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.state = {json: ""};
  }

  handleUpdate(event: EliteJournalEvent): void {
    this.setState({ json: event.eventJSON });
  }

  componentDidMount() {
    this.statusService.subscribe(this.handleUpdate);
  }

  componentWillUnmount() {
    this.wsStatus.close();
    this.statusService.unsubscribe(this.handleUpdate);
  }

  render() {
    if (this.state != null && this.state.json != null) {
      return <div>
        <h3>Journal Entry:</h3>
        <pre>{ this.state.json }</pre>
      </div>
    }
  }
}
