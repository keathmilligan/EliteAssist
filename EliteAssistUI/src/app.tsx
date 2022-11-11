import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import 'reflect-metadata';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { About } from './about';
import { DashboardWindow } from './dashboard/dashboard-window';
import { Settings } from './settings/settings';

library.add(fas);
library.add(far);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      'sans-serif',
    ].join(','),
  },
});

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
  let content: JSX.Element;
  if (params.get('window') == 'main') {
    content = <AppWindows/>;
  } else {
    content = <DashboardWindow name={ params.get('dashboard') }/>;
  }
  return ReactDOM.render((
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      { content }
    </ThemeProvider>
  ), document.body);
}

render();
