import React, { Component } from 'react';
import { container } from 'tsyringe';
import { DashboardService } from '../services/dashboard-service';
import { StatusService } from '../services/status-service';

export class Settings extends Component {
  private dashboardService: DashboardService
  private statusService: StatusService;

  constructor(props: never) {
    super(props);
    this.dashboardService = container.resolve(DashboardService);
    this.statusService = container.resolve(StatusService);
  }

  render() {
    const dashboards = this.dashboardService.dashboards;
    return (<div>
      <h1>Settings</h1>
      <p>There are <strong>{ dashboards.length }</strong> dashboards.</p>
    </div>);
  }
}
