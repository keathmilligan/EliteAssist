import { Rectangle } from 'electron';
import React, { Component } from 'react';
import { Button } from '../components/button';
import { WindowState } from '../models/window-state';
import './css/titlebar.css';

type TitlebarProps = {
  title: string;
  icon?: string;
  autoHide?: boolean;
  closeButton?: boolean;
  minimizeButton?: boolean;
  maximizeButton?: boolean;
  fullScreenButton?: boolean;
};

type TitlebarState = {
  hover: boolean;
  dragging: boolean;
  windowState?: WindowState;
};

export class Titlebar extends Component<TitlebarProps, TitlebarState> {
  static defaultProps = {
    autoHide: false,
    closeButton: true,
    minimizeButton: false,
    maximizeButton: false,
    fullScreenButton: false,
  };
  state: TitlebarState = {
    hover: false,
    dragging: false
  };
  dragAnchor = {x: 0, y: 0};
  dragStartBounds: Rectangle;

  constructor(props: TitlebarProps) {
    super(props);
  }

  componentDidMount(): void {
    window.ipc.onReceive("window-stopdrag", () => { this.setState({dragging: false}); });
    window.ipc.onReceive("window-state", (_, args) => {
      // const state = args[0] as WindowState;
      // console.log("updated state:", state, args);
      this.setState({windowState: args[0]});
    });
    setTimeout(() => {
      const state = window.ipc.sendSync("window-getstate", []) as WindowState;
      // console.log("initial state:", state);
      this.setState({windowState: state});
    }, 1);
  }

  render() {
    const buttons = [];
    if (this.props.minimizeButton) {
      buttons.push(<Button key="minimize" title="Minimize" showTitle={false}
                      icon={['fas', 'window-minimize']}
                      onClick={() => window.ipc.send("window-minimize", [])} />)
    }
    if (this.props.maximizeButton) {
      const title = this.state.windowState?.maximized? "Restore" : "Maximize";
      const icon = this.state.windowState?.maximized? "window-restore" : "window-maximize";
      buttons.push(<Button key="maximize" title={title} showTitle={false}
                      icon={['far', icon]}
                      onClick={() => window.ipc.send("window-maximize", [])} />)
    }
    if (this.props.fullScreenButton) {
      const title = this.state.windowState?.fullScreen? "Exit Full-Screen" : "Full-Screen";
      const icon = this.state.windowState?.fullScreen? "compress" : "expand";
      buttons.push(<Button key="fullScreen" title={title} showTitle={false}
                      icon={['fas', icon]}
                      onClick={() => window.ipc.send("window-fullscreen", [])} />)
    }
    if (this.props.closeButton) {
      buttons.push(<Button key="close" title="Close" showTitle={false}
                      icon={['fas', 'close']}
                      onClick={() => window.ipc.send("window-close", [])} />)
    }
    // frame: 4px, right: 8px, 24px/button
    const dragbarWidth = 6+24*buttons.length;
    let debounce: number;
    const visible = this.state.hover || (!this.props.autoHide)? "visible" : "";
    return (
      <div className={ "titlebar " + visible }
        onMouseOver={ () => {
          if (debounce) {
            window.clearTimeout(debounce);
          }
          this.setState({hover: true});
        } }
        onMouseOut={ () => {
          if (debounce) {
            window.clearTimeout(debounce);
          }
          debounce = window.setTimeout(() => this.setState({hover: false}), 1500);
        } }>
        <div className="dragbar" style={{width: `calc(100% - ${dragbarWidth}px)`}}
          onMouseDown={ (e) => {
            this.setState({dragging: true});
            // console.log("renderer: start drag");
            window.ipc.send("window-startdrag", [{ x: e.clientX, y: e.clientY }]);
        } }/>
        { this.props.icon && <img className="icon" src={ this.props.icon }/> }
        <div className="title">
          <div className="title-text">{ this.props.title }</div>
        </div>
        <div className="titlebar-buttons">
          {buttons}
        </div>
      </div>
    );
  }
}
