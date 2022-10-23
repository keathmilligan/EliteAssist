import React, { Component } from 'react';

type DashboardProps = {
  name: string;
};

type DashboardState = {
  visible: boolean;
};

export class Dashboard extends Component<DashboardProps, DashboardState> {
  state: DashboardState = {
    visible: false,
  };

  constructor(props: never) {
    super(props);
  }

  render() {
    return (<div>
      <h1>Dashboard: { this.props.name }</h1>
      <p>This is a dashboard</p>
    </div>);
  }
}
