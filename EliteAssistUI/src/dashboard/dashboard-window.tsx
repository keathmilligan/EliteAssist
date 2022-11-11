import React, { Component } from 'react';
import './dashboard-window.css';

type DashboardProps = {
  name: string;
};

type DashboardState = {
  visible: boolean;
};

export class DashboardWindow extends Component<DashboardProps, DashboardState> {
  state: DashboardState = {
    visible: false,
  };

  constructor(props: never) {
    super(props);
  }

  render() {
    return (<div className="dashboard-window">
      <div className="dashboard-frame">
        <div className="dashboard-canvas">
          <h1>Dashboard: { this.props.name }</h1>
          <p>This is a dashboard</p>
        </div>
      </div>
    </div>);
  }
}
