import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Template} from '../template';
import {Subscription} from 'rxjs/Subscription';
import {GameOfLifeService} from '../../game-of-life.service';
import {Router} from '@angular/router';
import {ConfigService} from '../../config/config.service';
import {ConfigType} from '../../config/config-type';
import {GameBoardStyleConfig} from '../../config/game-board-style-config';
import {RleService} from '../rle.service';
import {TemplatesService} from '../templates.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
  providers: [GameOfLifeService, ConfigService]
})
export class TemplateComponent implements OnInit {

  private templatePromise: Promise<Template> = new Promise<Template>((resolve) => resolve(this.template));

  @Input()
  templateWrapper = true;

  @Input()
  preview = true;

  @Input()
  private template: Template;

  @Input()
  private rleFile: string;

  @Input()
  private theme = 'Preview';

  @Input()
  loadingText = 'Loading...';

  private showDetails = false;

  constructor(private gol: GameOfLifeService,
              private templatesService: TemplatesService,
              private router: Router,
              private configService: ConfigService) { }

  ngOnInit(): void {
    if (this.rleFile != null) {
      this.templatePromise = this.templatesService.getTemplate(this.rleFile).toPromise();
      this.templatePromise.then((template: Template) => {
        this.template = template;
      });
    }
    const gbStyle: GameBoardStyleConfig = <GameBoardStyleConfig> this.configService.getConfig(ConfigType.GAME_BOARD_STYLE);
    this.configService.applyTheme(this.configService.findTheme(this.theme));

  }

  public isShowDetails(): boolean {
    return this.showDetails;
  }

  public toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  public getTemplate(): Template {
    return this.template;
  }

  public getTemplatePromise(): Promise<Template> {
    return new Promise<Template>((resolve) => resolve(this.template));
  }

}
