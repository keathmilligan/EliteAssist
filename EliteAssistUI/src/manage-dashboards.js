import React, { Component } from "react";

export class ManageDashboards extends Component {
  constructor(props) {
    super(props);
    window.eliteAssist.handleNewDashboard(() => this.newDashboard());
    window.eliteAssist.handleManageDashboards(() => this.manageDashboard());
  }

  manageDashboards() {

  }

  newDashboard() {
    
  }

  render() {
    return <p>Manage dashboards</p>;
  }
}
