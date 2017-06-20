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
        generations: false,
        alive: ['#5cb85c'],
        dead: ['#f1f3f3'],
        border: true,
        borderColor: '#bbc4c4',
        mutable: false
      }),
      new Theme({
        name: 'Matrix',
        generations: true,
        alive: ['#325843'],
        dead: ['#5e9177', '#0b180d'],
        border: true,
        borderColor: '#000000',
        mutable: false
      }),
      new Theme({
        name: 'Fire & Smoke',
        generations: true,
        alive: ['#f99407', '#f25806', '#cf3d04', '#f97104', '#a52802', '#f8e564', '#f6c82b', '#fcf793', '#6d1305'],
        dead: ['#150f16', '#5a585d', '#2f2f36', '#a5a6a4', '#3a0703'],
        border: true,
        borderColor: '#2f0501',
        mutable: false
      }),
      new Theme({
        name: 'Preview',
        generations: false,
        alive: ['#5bc0de'],
        dead: ['#ffffff'],
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
    gbStyle.generations = theme.generations;
    gbStyle.aliveCellColors = theme.alive;
    gbStyle.deadCellColors = theme.dead;
    gbStyle.borderColor = theme.borderColor;

    const gb = <GameBoardConfig> this.getConfig(ConfigType.GAME_BOARD);
    gb.cellSpace = theme.border ? 1 : 0;
  }
}
