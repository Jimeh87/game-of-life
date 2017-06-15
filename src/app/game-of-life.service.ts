import {Injectable, OnDestroy} from '@angular/core';
import {Template} from './templates/template';
import {Ticker} from './algorithm/ticker';
import {ListLife} from './algorithm/list-life';
import {Observable} from 'rxjs/Observable';
import {GolRule} from './templates/gol-rule';

@Injectable()
export class GameOfLifeService implements OnDestroy {

  private defaultRule = new GolRule('B3/S23');
  private template: Template;

  private ticker: Ticker;
  private listLife: ListLife;

  constructor() {
    this.ticker = new Ticker(50);
    this.listLife = new ListLife(this.defaultRule, this.ticker);
  }

  public isGameStarted(): boolean {
    return this.ticker.isStarted();
  }

  public startGame() {
    this.ticker.start();
  }

  public stopGame() {
    this.ticker.stop();
  }

  public clear() {
    this.stopGame();
    this.listLife.reset();
  }

  public tick() {
    this.ticker.tick();
  }

  get delay() {
    return this.ticker.delay;
  }

  set delay(value: number) {
    this.ticker.delay = value;
  }

  isAlive(x: number, y: number): boolean {
    return this.listLife.isAlive(x, y);
  }

  toggleCell(x: number, y: number) {
    this.listLife.toggleCell(x, y);
  }

  public getCellStateObservable(): Observable<{x: number, y: number, state: boolean}> {
    return this.listLife.getCellStateObservable();
  }

  applyTemplate(template: Template, gameboardX: number, gameboardY: number) {
    this.clear();
    this.template = template;
    this.listLife.setRule(template.getRule());
    const offsetX = Math.floor((gameboardX - template.getWidth()) / 2);
    const offsetY = Math.floor((gameboardY - template.getHeight()) / 2);
    this.listLife.setCells(offsetX, offsetY, ...template.getBlueprint());
    this.template = template;
  }

  getRule() {
    return this.listLife.getRule();
  }

  setRule(golRule: GolRule) {
    this.listLife.setRule(golRule);
  }

  clearTemplate() {
    this.template = null;
  }

  refresh(gameboardX: number, gameboardY: number) {
    if (this.template != null) {
      this.applyTemplate(this.template, gameboardX, gameboardY);
    }
  }

  isRefreshable() {
    return this.template != null;
  }

  ngOnDestroy() {
  }
}
