import {Component, Input, OnInit} from '@angular/core';
import {Template} from '../template';
import {Theme} from '../../config/theme';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {GameBoardConfig} from '../../config/game-board-config';
import {ConfigType} from '../../config/config-type';
import {ConfigService} from '../../config/config.service';
import {ThemeService} from '../../config/theme.service';
import {GameOfLifeService} from '../../game-of-life.service';

@Component({
  selector: 'app-template-preview-modal',
  templateUrl: './template-preview-modal.component.html',
  styleUrls: ['./template-preview-modal.component.css'],
  providers: [GameOfLifeService, ConfigService, ThemeService]
})
export class TemplatePreviewModalComponent implements OnInit {

  @Input()
  template: Template;
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

  public getTemplatePromise(): Promise<Template> {
    return new Promise<Template>((resolve) => resolve(this.template));
  }

  public isFullScreen() {
    return this.gameBoardConfig.fullScreen;
  }

  dismissFunction() {
    return this.activeModal.close;
  }

}
