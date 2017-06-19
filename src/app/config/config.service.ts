import {GameBoardConfig} from './game-board-config';
import {GameConfig} from './game-config';
import {ConfigType} from './config-type';
import {Config} from './config';
import {GameBoardStyleConfig} from './game-board-style-config';
import {Theme} from './theme';
export class ConfigService {

  private config: Config[] = [new GameBoardConfig(), new GameConfig(), new GameBoardStyleConfig()];

  themes: Theme[];
  _theme: Theme;

  constructor() {
    this.themes = [
      new Theme({
        name: 'Default',
        alive: ['#5cb85c'],
        dead: '#f1f3f3',
        border: true,
        borderColor: '#bbc4c4',
        mutable: false
      }),
      new Theme({
        name: 'Matrix',
        alive: ['#325843', '#325843', '#325843', '#5e9177'],
        dead: '#0b180d',
        border: true,
        borderColor: '#000000',
        mutable: false
      }),
      new Theme({
        name: 'Preview',
        alive: ['#5bc0de'],
        dead: '#ffffff',
        border: true,
        borderColor: '#ffffff',
        mutable: false
      })
    ];

    this.theme = this.findTheme('Default');
  }

  getConfig(configType: ConfigType) {
    return this.config.find(c => c.configType === configType);
  }

  set theme(theme: Theme) {
    this._theme = theme;
    this.applyTheme(theme);
  }

  get theme() {
    return this._theme;
  }

  findTheme(name: string) {
    return this.themes.find(t => t.name.toUpperCase() === name.toUpperCase());
  }

  applyCurrentTheme() {
    this.applyTheme(this.theme);
  }

  applyTheme(theme: Theme) {
    const gbStyle = <GameBoardStyleConfig> this.getConfig(ConfigType.GAME_BOARD_STYLE);
    gbStyle.aliveCellColors = theme.alive;
    gbStyle.deadCellColor = theme.dead;
    gbStyle.borderColor = theme.borderColor;

    const gb = <GameBoardConfig> this.getConfig(ConfigType.GAME_BOARD);
    gb.cellSpace = theme.border ? 1 : 0;
  }
}
