import {Config} from './config';
import {ConfigType} from './config-type';
import {ViewMode} from '../templates/view-mode-button/view-mode.enum';

export class TemplatesConfig extends Config {
  private _viewMode: ViewMode = ViewMode.STANDARD;

  constructor() {
    super(ConfigType.TEMPLATES);
  }

  get viewMode(): ViewMode {
    return this._viewMode;
  }

  set viewMode(value: ViewMode) {
    this._viewMode = value;
    this.emitChange();
  }
}
