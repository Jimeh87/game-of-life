import {Component, Input, OnInit} from '@angular/core';
import {Pattern} from '../pattern';
import {Theme} from '../../config/theme';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {GameBoardConfig} from '../../config/game-board-config';
import {ConfigType} from '../../config/config-type';
import {ConfigService} from '../../config/config.service';
import {ThemeService} from '../../config/theme.service';
import {GameOfLifeService} from '../../game-of-life.service';

@Component({
  selector: 'app-pattern-preview-modal',
  templateUrl: './pattern-preview-modal.component.html',
  styleUrls: ['./pattern-preview-modal.component.css'],
  providers: [GameOfLifeService, ConfigService, ThemeService]
})
export class PatternPreviewModalComponent implements OnInit {

  @Input()
  pattern: Pattern;
  @Input()
  theme: Theme;

  private gameBoardConfig: GameBoardConfig;

  constructor(private activeModal: NgbActiveModal,
              private configService: ConfigService,
              private themeService: ThemeService) {
  }

  ngOnInit() {
    this.gameBoardConfig = <GameBoardConfig>this.configService.getConfig(ConfigType.GAME_BOARD);
    this.themeService.activeTheme = this.theme;
  }

  public getPatterPromise(): Promise<Pattern> {
    return new Promise<Pattern>((resolve) => resolve(this.pattern));
  }

  public isFullScreen() {
    return this.gameBoardConfig.fullScreen;
  }

  dismissFunction() {
    return this.activeModal.close;
  }

}
