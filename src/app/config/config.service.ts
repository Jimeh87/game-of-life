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
        alive: ['#1da31a', '#1e8117', '#186f15', '#104d0f'],
        dead: ['#092f0a', '#031200', '#000'],
        border: true,
        borderColor: '#031200',
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
        dead: ['#fff'],
        border: true,
        borderColor: '#fff',
        mutable: false
      }),
      new Theme({
        name: 'K-A',
        generations: true,
        alive: ['#ee6aff', '#de00ff', '#a20cb6', '#5c0668'],
        dead: ['#2e8a8a', '#0e5353', '#000a0a'],
        border: true,
        borderColor: '#032121',
        mutable: false
      }),
      new Theme({
        name: 'Stars',
        generations: false,
        alive: ['#acb3be'],
        dead: ['#242b3a'],
        border: true,
        borderColor: '#2b3345',
        mutable: false
      }),
      new Theme({
        name: 'Psychedelic',
        generations: true,
        alive: ['#616fc7', '#3997ba', '#2fb6a0', '#27cc73', '#68dd27'],
        dead: ['#df577f', '#d7359f', '#f06a4a', '#9941d0'],
        border: false,
        borderColor: '#8a3abc',
        mutable: false
      }),
      new Theme({
        name: 'Canada 150',
        generations: false,
        alive: ['#fb0100'],
        dead: ['#fefefe'],
        border: true,
        borderColor: '#edc8ca',
        mutable: false
      }),
      new Theme({
        name: 'Snow Storm',
        generations: true,
        alive: ['#e9e9e8'],
        dead: ['#86a1af', '#274758'],
        border: true,
        borderColor: '#e9e9e8',
        mutable: false
      }),
      new Theme({
        name: 'Heat Map',
        generations: true,
        alive: ['#00E136', '#0CDD00', '#4DD900', '#8CD500', '#C8D200', '#CE9900', '#CA5900', '#C61C00', '#C2001E', '#bf0056'],
        dead: ['#0900D2'],
        border: true,
        borderColor: '#0700af',
        mutable: false
      }),
      new Theme({
        name: 'Water',
        generations: true,
        alive: ['#0275d8', '#022ad8', '#041892'],
        dead: ['rgba(1,21,146,0.85)', 'rgba(1,21,146,0.56)', 'rgba(1,21,146,0.24)', 'rgba(1,21,146,0)'],
        border: true,
        borderColor: 'rgba(1,21,146,0)',
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
