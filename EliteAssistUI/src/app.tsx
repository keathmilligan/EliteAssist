import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import 'reflect-metadata';
import { About } from './about';
import { Dashboard } from './dashboard/dashboard';
import { Settings } from './settings/settings';

type AppWindowState = {
  showAbout: boolean;
};

class AppWindows extends Component<unknown, AppWindowState> {
  state: AppWindowState = {
    showAbout: false,
  };

  constructor(props: never) {
    super(props);
    window.ipc.onReceive('about', () => this.setState({showAbout: true}));
  }

  render() {
    return (
      <div>
        <Settings/>
        { this.state.showAbout && <About onClose={ () => this.setState({showAbout: false})}/> }
      </div>
    );
  }
}

function render() {
  const params = new URLSearchParams(global.location.search);
  if (params.get('window') == 'main') {
    ReactDOM.render(<AppWindows/>, document.body);
  } else {
    ReactDOM.render(<Dashboard name={ params.get('dashboard') }/>, document.body);
  }
}

render();
