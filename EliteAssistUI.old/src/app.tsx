import 'reflect-metadata';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const versions: any;

function render() {
  ReactDOM.render(
    <div>
      <p>Node: {versions.node} Chrome: {versions.chrome} Electron: {versions.electron}</p>
    </div>
    , document.body);
}

render();
