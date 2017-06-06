import {GameBoardConfig} from './game-board-config';
import {GameConfig} from './game-config';
import {ConfigType} from './config-type';
import {Config} from './config';
export class ConfigService {

  private config: Config[] = [new GameBoardConfig(), new GameConfig()];

  constructor() {
  }

  getConfig(configType: ConfigType) {
    return this.config.find(c => c.configType === configType);
  }
}
