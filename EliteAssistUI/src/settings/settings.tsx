import React, { Component } from 'react';
import { Titlebar } from '../components/titlebar';
import './settings.css';
import logo from '../images/elite-assist.svg';
import { DashboardList } from './dashboard-list';
import { DashboardConfig } from './dashboard-config';
import { Dashboard } from '../models/generated/dashboard';

type SettingsState = {
  dashboard?: Dashboard;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export class Settings extends Component<{}, SettingsState> {
  state: SettingsState = {};

  constructor(props: never) {
    super(props);
    this.onSelectDashboard = this.onSelectDashboard.bind(this);
    this.onNewDashboard = this.onNewDashboard.bind(this);
    this.onActions = this.onActions.bind(this);
    this.onHotKeys = this.onHotKeys.bind(this);
    this.onAbout = this.onAbout.bind(this);
    this.onQuit = this.onQuit.bind(this);
    this.onSaveDashboard = this.onSaveDashboard.bind(this);
    this.onDeleteDashboard = this.onDeleteDashboard.bind(this);
  }

  onSelectDashboard(dashboard: Dashboard) {
    this.setState({
      dashboard: this.state.dashboard !== dashboard? dashboard : undefined
    });
  }

  onNewDashboard() {
    if (!this.state.dashboard || this.state.dashboard.id != undefined) {
      this.setState({
        dashboard:{
          name: '',
          overlay: true,
          clickThrough: false,
          titlebar: true
        }
      });
    }
  }

  onActions() {
    console.log('onActions');
  }

  onHotKeys() {
    console.log('onHotKeys');
  }

  onAbout() {
    console.log('onAbout');
    window.ipc.send('about', []);
  }

  onQuit() {
    console.log('onQuit');
    window.ipc.send('quit', []);
  }

  onSaveDashboard(dashboard: Dashboard) {
    console.log('onSaveDashboard', dashboard);
  }

  onDeleteDashboard(dashboard: Dashboard) {
    console.log('onDeleteDashboard', dashboard);
    this.setState({dashboard: undefined});
  }

  render() {
    return (
      <div className='settings-window'>
        <div className='settings-frame'>
          <div className='background' />
          <Titlebar
            title='EliteAssist'
            icon={logo}
          />
          <div className='settings-content'>
            <div className='sidebar'>
              <DashboardList
                selectedDashboard={this.state.dashboard}
                onSelect={this.onSelectDashboard}
              />
              <div className='menu'>
                <div
                  className='menu-item'
                  onClick={this.onNewDashboard}
                >
                  New Dashboard
                </div>
                <div
                  className='menu-item'
                  onClick={this.onActions}
                >
                  Actions
                </div>
                <div
                  className='menu-item'
                  onClick={this.onHotKeys}
                >
                  Hot Keys
                </div>
                <div
                  className='menu-item'
                  onClick={this.onAbout}
                >
                  About
                </div>
                <div
                  className='menu-item'
                  onClick={this.onQuit}
                >
                  Quit
                </div>
              </div>
            </div>
            <div className='config-panel'>
              <DashboardConfig
                dashboard={this.state.dashboard}
                onSave={this.onSaveDashboard}
                onDelete={this.onDeleteDashboard}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
