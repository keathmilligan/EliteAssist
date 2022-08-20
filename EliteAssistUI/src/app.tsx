import 'reflect-metadata';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EliteStatus } from './status';
import { EliteJournal } from './journal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const versions: any;

function render() {
  ReactDOM.render(
    <div>
      <h2>Hello from React!</h2>
      <p>Node: {versions.node} Chrome: {versions.chrome} Electron: {versions.electron}</p>
      <EliteStatus/>
      <EliteJournal/>
    </div>
    , document.body);
}

render();
