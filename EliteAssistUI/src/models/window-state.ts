import { Rectangle } from "electron";

export type WindowState = {
  bounds: Rectangle,
  visible: boolean,
  minimized: boolean,
  maximized: boolean,
  fullScreen: boolean,
  isNormal: boolean,
};
