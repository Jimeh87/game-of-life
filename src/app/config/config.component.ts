import { Component, OnInit } from '@angular/core';
import {ConfigService} from './config.service';
import {GameBoardStyleConfig} from './game-board-style-config';
import {ConfigType} from './config-type';
import {GameBoardConfig} from './game-board-config';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  gbStyleConfig: GameBoardStyleConfig;
  gbConfig: GameBoardConfig;

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.gbStyleConfig = <GameBoardStyleConfig> this.configService.getConfig(ConfigType.GAME_BOARD_STYLE);
    this.gbConfig = <GameBoardConfig> this.configService.getConfig(ConfigType.GAME_BOARD);
  }

  test() {
    console.log('pong is dum');
  }

}
