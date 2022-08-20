import React, { Component } from 'react';
import {container} from 'tsyringe';
import {EliteStatusService, EliteStatusEvent} from './elite-status-service';

type EliteState = {
  json: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export class EliteStatus extends Component<{}, EliteState> {
  wsStatus: WebSocket;
  statusService: EliteStatusService;

  constructor(props: never) {
    super(props);
    this.statusService = container.resolve(EliteStatusService);

    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(event: EliteStatusEvent): void {
    this.setState({ json: event.statusJSON });
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
        <h3>Game state:</h3>
        <pre>{ this.state.json }</pre>
      </div>
    }
  }
}
