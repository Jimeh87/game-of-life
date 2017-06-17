import {Config} from './config';
import {ConfigType} from './config-type';

export class GameBoardStyleConfig extends Config {

  private _borderColor = '#bbc4c4';

  private _aliveCellColors: string[] = ['#5cb85c'];// ['#5cb85c', 'pink'];
  private aliveCellColorIndex = 0;

  private _deadCellColor = '#f1f3f3';

  constructor() {
    super(ConfigType.GAME_BOARD_STYLE);
  }

  get borderColor(): string {
    return this._borderColor;
  }

  set borderColor(value: string) {
    this._borderColor = value;
    this.emitChange();
  }

  get aliveCellColors(): string[] {
    return this._aliveCellColors;
  }

  set aliveCellColors(value: string[]) {
    this._aliveCellColors = value;
    this.emitChange();
  }

  get nextAliveCellColor(): string {
    const nextColor = this._aliveCellColors[this.aliveCellColorIndex];
    this.aliveCellColorIndex = (this.aliveCellColorIndex + 1) % this._aliveCellColors.length;
    return nextColor;
  }

  get deadCellColor(): string {
    return this._deadCellColor;
  }

  set deadCellColor(value: string) {
    this._deadCellColor = value;
    this.emitChange();
  }
}
