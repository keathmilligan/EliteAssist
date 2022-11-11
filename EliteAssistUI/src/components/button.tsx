import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import './css/button.css';

type ButtonProps = {
  title: string;
  showTitle?: boolean;
  icon?: [IconPrefix, IconName];
  onClick: () => void
};

type ButtonState = {
  hover: boolean;
};

export class Button extends Component<ButtonProps, ButtonState> {
  state: ButtonState = {
    hover: false,
  };

  constructor(props: ButtonProps) {
    super(props);
  }

  render() {
    return (
      <div className={ "button" + (this.state.hover? " hover" : "") }
            onMouseOver={() => this.setState({hover: true})}
            onMouseOut={() => this.setState({hover: false})}
            onClick={this.props.onClick}>
        <div className="button-content">
          { this.props.icon &&
            <div className={ "button-icon" + (this.state.hover? " hover" : "") }>
              <FontAwesomeIcon icon={this.props.icon}/>
            </div> }
          { this.props.showTitle &&
            <div className="button-title">{ this.props.title }</div> }
        </div>
      </div>
    );
  }
}
