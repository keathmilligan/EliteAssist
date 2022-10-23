import React, { Component } from 'react';
import NewWindow from "react-new-window";

export type AboutProps = {
  onClose?: () => void;
}

export class About extends Component<AboutProps> {
  constructor(props: never) {
    super(props);
  }

  onUnload() {
    if (this.props.onClose != undefined) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <NewWindow title="About" url="about:blank#dialog" onUnload={ () => this.onUnload() }>
        <div className="dialog">
          <h2>About</h2>
          <h3>EliteAssist</h3>
          <p>A companion application for Elite Dangerous.</p>
        </div>
      </NewWindow>
    );
  }
}
