import {ChangeDetectionStrategy, Component, OnInit, AfterViewInit} from '@angular/core';
import {ConfigService} from './config.service';
import {GameBoardStyleConfig} from './game-board-style-config';
import {ConfigType} from './config-type';
import {GameBoardConfig} from './game-board-config';
import {Theme} from './theme';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit, AfterViewInit {

  private gbStyleConfig: GameBoardStyleConfig;
  private gbConfig: GameBoardConfig;
  private changeDetectionEnabled = false;

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.gbStyleConfig = <GameBoardStyleConfig> this.configService.getConfig(ConfigType.GAME_BOARD_STYLE);
    this.gbConfig = <GameBoardConfig> this.configService.getConfig(ConfigType.GAME_BOARD);
  }

  ngAfterViewInit() {
    // The color picker will change "invalid values" sometimes causing additional themes to be created
    // Disabling custom change detection prevents this.
    this.changeDetectionEnabled = true;
  }

  get themes(): Theme[] {
    return this.configService.themes;
  }

  get name(): string {
    return this.configService.theme.name;
  }

  set name(value: string) {
    this.configService.theme = this.configService.findTheme(value);
  }

  get generations(): boolean {
    return this.configService.theme.generations;
  }

  set generations(value: boolean) {
    this.cloneIfNotMutable();
    this.configService.theme.generations = value;
    this.configService.applyCurrentTheme();
  }

  get alive(): string[] {
    return this.configService.theme.alive;
  }

  setAlive(index: number, value: string) {
    this.cloneIfNotMutable();
    this.configService.theme.alive[index] = value;
    this.configService.applyCurrentTheme();
  }

  pushAlive(value: string) {
    this.cloneIfNotMutable();
    this.configService.theme.alive.push(value);
    this.configService.applyCurrentTheme();
  }

  removeAlive(index: number) {
    this.cloneIfNotMutable();
    this.configService.theme.alive.splice(index, 1);
    this.configService.applyCurrentTheme();
  }

  get dead(): string[] {
    return this.configService.theme.dead;
  }

  setDead(index: number, value: string) {
    this.cloneIfNotMutable();
    this.configService.theme.dead[index] = value;
    this.configService.applyCurrentTheme();
  }

  pushDead(value: string) {
    this.cloneIfNotMutable();
    this.configService.theme.dead.push(value);
    this.configService.applyCurrentTheme();
  }

  removeDead(index: number) {
    this.cloneIfNotMutable();
    this.configService.theme.dead.splice(index, 1);
    this.configService.applyCurrentTheme();
  }

  get border(): boolean {
    return this.configService.theme.border;
  }

  set border(value: boolean) {
    this.cloneIfNotMutable();
    this.configService.theme.border = value;
    this.configService.applyCurrentTheme();
  }

  get borderColor(): string {
    return this.configService.theme.borderColor;
  }

  set borderColor(value: string) {
    this.cloneIfNotMutable();
    this.configService.theme.borderColor = value;
    this.configService.applyCurrentTheme();
  }

  private cloneIfNotMutable() {
    if (this.changeDetectionEnabled && !this.configService.theme.mutable) {
      const theme: Theme = this.configService.theme;
      let index = 0;
      let customName: string;
      do {
        index++;
        customName = theme.name + ' (' + index + ')';
      } while (this.configService.findTheme(customName) != null);
      const customTheme = theme.clone(customName, true);
      this.configService.themes.push(customTheme);
      this.configService.theme = customTheme;
    }
  }

  trackBy(index, item) {
    return index;
  }

}
