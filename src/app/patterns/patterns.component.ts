import {Component, OnDestroy, OnInit} from '@angular/core';
import {PatternsService} from './patterns.service';
import {BehaviorSubject, combineLatest, interval, Subscription} from 'rxjs';
import {PatternQuery} from './search/pattern-query';
import {ViewMode} from './view-mode-button/view-mode.enum';
import {delay, delayWhen, mergeMap} from 'rxjs/operators';
import {QueryProcessor} from './query-processor';
import {ConfigService} from '../config/config.service';
import {PatternsConfig} from '../config/patterns-config';
import {ConfigType} from '../config/config-type';

@Component({
  selector: 'app-patterns',
  templateUrl: './patterns.component.html',
  styleUrls: ['./patterns.component.css']
})
export class PatternsComponent implements OnInit, OnDestroy {

  private patternsConfig: PatternsConfig = <PatternsConfig>this.configService.getConfig(ConfigType.PATTERNS);
  private _updatingPage$ = new BehaviorSubject(false);
  updatingPage$ = this._updatingPage$.pipe(delayWhen(v => v ? interval(0) : interval(500)));
  private query$ = new BehaviorSubject<PatternQuery>(null);
  filteredPatterns$ = combineLatest(this.patternsService.getPatterns(), this.query$)
    .pipe(
      delay(50),
      mergeMap(([patterns, query]) => QueryProcessor.process(patterns, query).pipe(delay(50))));
  viewMode = this.patternsConfig.viewMode;
  viewModeType = ViewMode;
  theme = this.patternsConfig.theme;
  configSubscription: Subscription;

  constructor(private patternsService: PatternsService,
              private configService: ConfigService) {
  }

  ngOnInit() {
    this.configSubscription = this.patternsConfig.observe.subscribe(() => {
      this.onConfigChange();
    });
  }

  queryChanged(patternQuery: PatternQuery) {
    this.query$.next(patternQuery);
  }

  toPatternsTop() {
    window.scroll(0, 0);
  }

  private onConfigChange() {
    this._updatingPage$.next(true);
    this.viewMode = this.patternsConfig.viewMode;
    this.theme = this.patternsConfig.theme;
    this._updatingPage$.next(false);
  }

  get page(): number {
    return this.patternsService.page;
  }

  set page(value) {
    this.patternsService.page = value;
  }

  ngOnDestroy(): void {
    this.configSubscription.unsubscribe();
  }

}
