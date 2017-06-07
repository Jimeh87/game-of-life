import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {TemplatesService} from './templates.service';
import {Template} from './template';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit, OnChanges, OnDestroy {

  // TODO: This is wrong.. use https://stackoverflow.com/questions/36101756/angular2-routing-with-hashtag-to-page-anchor
  @ViewChild('')
  private window: Window;

  loading = true;

  private templates: Template[];
  private subscription: Subscription;

  private _filter = '';
  private resetPage = false;

  constructor(private templatesService: TemplatesService) {
  }

  ngOnInit() {
    this.subscription = this.templatesService.getTemplates()
      .subscribe((templates: Template[]) => {
        this.templates = templates;
        this.loading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['_filter'] != null && changes['_filter'].currentValue !== changes['_filter'].previousValue) {
      // this.resetPage = true;
      // this.templatesService.page = 1;
    }
  }

  getTemplates() {
    return this.templates;
  }

  get page(): number {
    return this.templatesService.page;
  }

  set page(value) {
    if (!this.resetPage) {
      window.location.hash = 'top';
      window.location.hash = '';
    }
    this.resetPage = false;
    this.templatesService.page = value;
  }

  get filter(): string {
    return this._filter;
  }

  set filter(value: string) {
    this._filter = value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
