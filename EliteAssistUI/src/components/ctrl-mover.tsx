import React, { Component } from 'react';
import './css/ctrl-mover.css';

// eslint-disable-next-line @typescript-eslint/ban-types
type CtrlMoverProps = {
  ctrlKey?: string;
};

type CtrlMoverState = {
  ctrlDown: boolean;
  mouseDown: boolean;
  dragging: boolean;
};

export class CtrlMover extends Component<CtrlMoverProps, CtrlMoverState> {
  static defaultProps = {
    ctrlKey: "Control"
  };
  state = {
    ctrlDown: false,
    mouseDown: false,
    dragging: false
  };
  dragStart = {x: 0, y: 0};

  constructor(props: CtrlMoverProps) {
    super(props);
  }

  componentDidMount(): void {
    window.ipc.onReceive("window-stopdrag", () => {
      this.setState({dragging: false});
    });

    window.onkeydown = (e) => {
      if (e.key == this.props.ctrlKey && !this.state.ctrlDown) {
        this.setState({ctrlDown: true});
        if (this.state.mouseDown) {
          this.setState({dragging: true});
          window.ipc.send("window-startdrag", [{ x: this.dragStart.x,
                                                  y: this.dragStart.y }]);
        }
      }
    };
    window.onkeyup = (e) => {
      if (e.key == this.props.ctrlKey) {
        this.setState({ctrlDown: false});
      }
    };
    window.onmousedown = (e) => {
      if (!this.state.mouseDown) {
        this.setState({mouseDown: true});
        this.dragStart = {x: e.clientX, y: e.clientY};
        if (this.state.ctrlDown) {
          this.setState({dragging: true});
          window.ipc.send("window-startdrag", [{ x: e.clientX, y: e.clientY }]);
        }
      }
    };
    window.onmouseup = () => {
      this.setState({mouseDown: false});
    };
  }

  render() {
    return <div className={ "ctrl-mover" + (this.state.ctrlDown? " ctrl-down" : "") }/>;
  }
}
