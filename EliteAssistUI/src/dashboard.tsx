import React from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";
import './dashboard.css';
const ResponsiveReactGridLayout = WidthProvider(Responsive);


export default class Dashboard extends React.Component {
  render() {
    return (
      <ResponsiveReactGridLayout>
        <div key="1"><span>Hello 1</span></div>
        <div key="2"><span>Hello 2</span></div>
        <div key="3"><span>Hello 3</span></div>
        <div key="4"><span>Hello 4</span></div>
      </ResponsiveReactGridLayout>
    );
  }
}
