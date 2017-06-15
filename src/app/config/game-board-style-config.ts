import {Config} from './config';
import {ConfigType} from './config-type';

export class GameBoardStyleConfig extends Config {

  private _borderColour = '#bbc4c4';

  private _aliveCellColour = '#5cb85c';

  private _deadCellColour = '#f1f3f3';

  constructor() {
    super(ConfigType.GAME_BOARD_STYLE);
  }

  get borderColour(): string {
    return this._borderColour;
  }

  set borderColour(value: string) {
    this._borderColour = value;
    this.emitChange();
  }

  get aliveCellColour(): string {
    return this._aliveCellColour;
  }

  set aliveCellColour(value: string) {
    this._aliveCellColour = value;
    this.emitChange();
  }

  get deadCellColour(): string {
    return this._deadCellColour;
  }

  set deadCellColour(value: string) {
    this._deadCellColour = value;
    this.emitChange();
  }
}
