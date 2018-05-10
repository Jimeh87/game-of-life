import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameOfLifeService} from '../game-of-life.service';
import {ConfigService} from '../config/config.service';
import {GameBoardConfig} from '../config/game-board-config';
import {ConfigType} from '../config/config-type';
import {GameControlAction, GameControlActionAware} from './game-control-action';
import {Ticker} from '../algorithm/ticker';
import {GolRule} from '../templates/gol-rule';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'app-game-board-hud',
  templateUrl: './game-board-hud.component.html',
  styleUrls: ['./game-board-hud.component.css']
})
@GameControlActionAware // TODO: This doesn't seem to work
export class GameBoardHudComponent implements OnInit, OnDestroy {

  GCA = GameControlAction;

  private ticker: Ticker = new Ticker(50);
  private currentAction: GameControlAction = null;
  private subscription: Subscription;

  private menuHidden = false;
  private gameBoardConfig: GameBoardConfig;
  private currentSpeed = GameControlAction.SPEED_NORMAL;
  private _actionTitle = {};

  constructor(private gameOfLifeService: GameOfLifeService, private configService: ConfigService) {
  }

  ngOnInit() {
    this.gameBoardConfig = <GameBoardConfig> this.configService.getConfig(ConfigType.GAME_BOARD);

    this._actionTitle[GameControlAction.START_GAME] = 'Start Game';
    this._actionTitle[GameControlAction.STOP_GAME] = 'Stop Game';
    this._actionTitle[GameControlAction.STEP] = 'Step';
    this._actionTitle[GameControlAction.ERASE] = 'Erase';
    this._actionTitle[GameControlAction.RESET] = 'Reset';
    this._actionTitle[GameControlAction.ZOOM_IN] = 'Zoom In';
    this._actionTitle[GameControlAction.ZOOM_OUT] = 'Zoom Out';
    this._actionTitle[GameControlAction.FULL_SCREEN] = 'Full Screen';
    this._actionTitle[GameControlAction.RESTORE_SCREEN] = 'Restore Screen';
    this._actionTitle[GameControlAction.UP] = 'Pan Up';
    this._actionTitle[GameControlAction.DOWN] = 'Pan Down';
    this._actionTitle[GameControlAction.LEFT] = 'Pan Left';
    this._actionTitle[GameControlAction.RIGHT] = 'Pan Right';
    this._actionTitle[GameControlAction.SPEED_VERY_FAST] = 'Very Fast';
    this._actionTitle[GameControlAction.SPEED_FAST] = 'Fast';
    this._actionTitle[GameControlAction.SPEED_NORMAL] = 'Normal';
    this._actionTitle[GameControlAction.SPEED_SLOW] = 'Slow';
    this._actionTitle[GameControlAction.SPEED_VERY_SLOW] = 'Very Slow';

    this.subscription = this.ticker.getObservable().subscribe(() => {
      this.action(this.currentAction);
    });

  }

  get actionTitle(): {} {
    return this._actionTitle;
  }

  action(gca: GameControlAction) {
    switch (+gca) {
      case GameControlAction.START_GAME:
        this.gameOfLifeService.startGame();
        break;
      case GameControlAction.STOP_GAME:
        this.gameOfLifeService.stopGame();
        break;
      case GameControlAction.STEP:
        this.gameOfLifeService.stopGame();
        this.gameOfLifeService.tick();
        break;
      case GameControlAction.ERASE:
        this.gameOfLifeService.stopGame();
        this.gameOfLifeService.clear();
        break;
      case GameControlAction.RESET:
        this.gameOfLifeService.stopGame();
        this.gameBoardConfig.yScreenOffset = 0;
        this.gameBoardConfig.xScreenOffset = 0;
        this.gameOfLifeService.refresh(this.gameBoardConfig.columns, this.gameBoardConfig.rows);
        break;
      case GameControlAction.ZOOM_IN:
        this.gameBoardConfig.zoom += 1;
        break;
      case GameControlAction.ZOOM_OUT:
        this.gameBoardConfig.zoom -= 1;
        break;
      case GameControlAction.FULL_SCREEN:
        this.gameBoardConfig.fullScreen = true;
        break;
      case GameControlAction.RESTORE_SCREEN:
        this.gameBoardConfig.fullScreen = false;
        break;
      case GameControlAction.UP:
        this.gameBoardConfig.yScreenOffset--;
        break;
      case GameControlAction.DOWN:
        this.gameBoardConfig.yScreenOffset++;
        break;
      case GameControlAction.LEFT:
        this.gameBoardConfig.xScreenOffset--;
        break;
      case GameControlAction.RIGHT:
        this.gameBoardConfig.xScreenOffset++;
        break;
      case GameControlAction.SPEED_VERY_SLOW:
        this.gameOfLifeService.delay = 400;
        this.currentSpeed = gca;
        break;
      case GameControlAction.SPEED_SLOW:
        this.gameOfLifeService.delay = 120;
        this.currentSpeed = gca;
        break;
      case GameControlAction.SPEED_NORMAL:
        this.gameOfLifeService.delay = 50;
        this.currentSpeed = gca;
        break;
      case GameControlAction.SPEED_FAST:
        this.gameOfLifeService.delay = 30;
        this.currentSpeed = gca;
        break;
      case GameControlAction.SPEED_VERY_FAST:
        this.gameOfLifeService.delay = 1;
        this.currentSpeed = gca;
        break;
    }
  }

  holdAction(gca: GameControlAction, active: boolean) {
    if (active) {
      this.currentAction = gca;
      this.ticker.start();
    } else {
      this.ticker.stop();
      this.currentAction = null;
    }
  }

  getCurrentSpeed(): GameControlAction {
    return this.currentSpeed;
  }

  isGameStarted() {
    return this.gameOfLifeService.isGameStarted();
  }

  isMenuHidden() {
    return this.menuHidden;
  }

  isFullScreen() {
    return this.gameBoardConfig.fullScreen;
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  isRefreshable() {
    return this.gameOfLifeService.isRefreshable();
  }

  getRule(): GolRule {
    return this.gameOfLifeService.getRule();
  }

  setRule(ruleString: string) {
    this.gameOfLifeService.setRule(new GolRule(ruleString));
  }

  rules() {
    return GolRule.COMMON_RULES;
  }

  ngOnDestroy() {
    this.action(GameControlAction.STOP_GAME);
    this.action(GameControlAction.SPEED_NORMAL);
    this.action(GameControlAction.RESTORE_SCREEN);
    this.subscription.unsubscribe();
  }

}
