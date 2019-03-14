import {Component, OnDestroy, OnInit} from '@angular/core';
import {Pattern} from '../../patterns/pattern';
import {PatternsService} from '../../patterns/patterns.service';
import {ActivatedRoute, Params} from '@angular/router';
import {ConfigService} from '../../config/config.service';
import {GameBoardConfig} from '../../config/game-board-config';
import {ConfigType} from '../../config/config-type';

@Component({
  selector: 'app-main-editor',
  templateUrl: './main-editor.component.html',
  styleUrls: ['./main-editor.component.css']
})
export class MainEditorComponent implements OnInit, OnDestroy {

  private pattern: Promise<Pattern>;

  private gameBoardConfig: GameBoardConfig;

  constructor(private configService: ConfigService,
              private patternsService: PatternsService,
              private route: ActivatedRoute) {
  };

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.pattern = params['rle'] != null ? this.patternsService.getPattern(params['rle']).toPromise() : null;
      }
    );

    this.gameBoardConfig = <GameBoardConfig>this.configService.getConfig(ConfigType.GAME_BOARD);
  }

  public getPatternPromise(): Promise<Pattern> {
    return this.pattern;
  }

  public isFullScreen() {
    return this.gameBoardConfig.fullScreen;
  }

  ngOnDestroy() {
  }

}
