export enum GameControlAction {
  START_GAME,
  STOP_GAME,
  STEP,
  ERASE,
  ZOOM_IN,
  ZOOM_OUT,
  FULL_SCREEN,
  RESTORE_SCREEN,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  SPEED_VERY_FAST,
  SPEED_FAST,
  SPEED_NORMAL,
  SPEED_SLOW,
  SPEED_VERY_SLOW
}

export function GameControlActionAware(constructor: Function) {
  constructor.prototype.GameControlAction = GameControlAction;
}
