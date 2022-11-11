import React, { Component, CSSProperties } from 'react';
import { Scrollbars } from 'rc-scrollbars';
import css from 'dom-css';

type ShadowScrollbarsProps = {
  style?: CSSProperties;
  children?: JSX.Element  | JSX.Element[];
};

class ShadowScrollbars extends Component<ShadowScrollbarsProps> {
  constructor(props: ShadowScrollbarsProps) {
    super(props);
    this.state = {
      scrollTop: 0,
      scrollHeight: 0,
      clientHeight: 0,
    };
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(values: { scrollTop: any; scrollHeight: any; clientHeight: any; }) {
    const { shadowTop, shadowBottom } = this.refs;
    const { scrollTop, scrollHeight, clientHeight } = values;
    const shadowTopOpacity = (1 / 20) * Math.min(scrollTop, 20);
    const bottomScrollTop = scrollHeight - clientHeight;
    const shadowBottomOpacity =
      (1 / 20) * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20));
    css(shadowTop, { opacity: shadowTopOpacity });
    css(shadowBottom, { opacity: shadowBottomOpacity });
  }

  render() {
    const { style, ...props } = this.props;
    const containerStyle: CSSProperties = {
      ...style,
      position: 'relative',
    };
    const shadowTopStyle: CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 50,
      background: 'linear-gradient(to top, rgba(20, 20, 20, 0.0), rgba(20, 20, 20, 1.0))',
      pointerEvents: 'none'
    };
    const shadowBottomStyle: CSSProperties = {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 50,
      background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0.0), rgba(20, 20, 20, 1.0))',
      pointerEvents: 'none'
    };
    return (
      <div style={containerStyle}>
        <Scrollbars disableDefaultStyles children={this.props.children} ref="scrollbars" onUpdate={this.handleUpdate} {...props} />
        <div ref="shadowTop" style={shadowTopStyle} />
        <div ref="shadowBottom" style={shadowBottomStyle} />
      </div>
    );
  }
}

export default ShadowScrollbars;
