import {Component} from '@angular/core';
import {TemplatesService} from './templates.service';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {TemplateQuery} from './search/template-query';
import {ViewMode} from './view-mode-button/view-mode.enum';
import {delay, mergeMap} from 'rxjs/operators';
import {QueryProcessor} from './query-processor';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent {

  private query$ = new BehaviorSubject<TemplateQuery>(null);
  private forceReload$ = new BehaviorSubject<any>(null);
  filteredTemplates$ = combineLatest(this.templatesService.getTemplates(), this.query$, this.forceReload$)
    .pipe(
      delay(50),
      mergeMap(([templates, query, forceReload]) => QueryProcessor.process(templates, query).pipe(delay(50)))
    );
  wideViewMode = false;

  constructor(private templatesService: TemplatesService) {
  }

  queryChanged(templateQuery: TemplateQuery) {
    this.query$.next(templateQuery);
  }

  toTemplatesTop() {
    window.scroll(0, 0);
  }

  changeActiveViewMode(viewMode: ViewMode) {
    this.wideViewMode = viewMode === ViewMode.WIDE;
    this.forceReload$.next(null);
  }

  get page(): number {
    return this.templatesService.page;
  }

  set page(value) {
    this.templatesService.page = value;
  }

}
