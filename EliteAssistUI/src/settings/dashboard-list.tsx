import React, { Component, MouseEvent } from 'react';
import { container } from 'tsyringe';
import { DashboardService } from '../services/dashboard-service';
import './dashboard-list.css';
import { Dashboard } from '../models/generated/dashboard';
import ShadowScrollbars from '../components/shadow-scrollbars';


type DashboardListItemProps = {
  dashboard: Dashboard;
  selectedDashboard?: Dashboard;
  onSelect: (dashboard: Dashboard) => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
class DashboardListItem extends Component<DashboardListItemProps, {}> {
  constructor(props: DashboardListItemProps) {
    super(props);
  }

  render() {
    const selected = this.props.selectedDashboard != undefined &&
                     this.props.selectedDashboard.name == this.props.dashboard.name;
    return (
      <div className={"dashboard-item" + (selected? " selected" : "" )}
        onClick={(event) => {
          if (event.detail == 1) {
            this.props.onSelect(this.props.dashboard);
          } else {
            // show dashboard
          }
        }}
      >
        {this.props.dashboard.name}
      </div>
    )
  }
}

type DashboardListProps = {
  onSelect: (dashboard: Dashboard) => void;
  selectedDashboard?: Dashboard;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export class DashboardList extends Component<DashboardListProps, {}> {
  private dashboardService: DashboardService
  constructor(props: never) {
    super(props);
    this.dashboardService = container.resolve(DashboardService);
  }

  render() {
    return (
      <div className="dashboard-list">
        <ShadowScrollbars>
          { this.dashboardService.dashboards.map((dashboard) =>
            <DashboardListItem key={dashboard.name} dashboard={dashboard}
              selectedDashboard={this.props.selectedDashboard}
              onSelect={() => this.props.onSelect(dashboard)}/>) }
        </ShadowScrollbars>
      </div>
    );
  }
}
