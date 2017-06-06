import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TemplatesService} from './templates.service';
import {Template} from './template';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit, OnDestroy {

  // TODO: This is wrong.. use https://stackoverflow.com/questions/36101756/angular2-routing-with-hashtag-to-page-anchor
  @ViewChild('')
  private window: Window;

  loading = true;

  private templates: Template[];
  private subscription: Subscription;

  private _filter = '';

  constructor(private templatesService: TemplatesService) {
  }

  ngOnInit() {
    this.subscription = this.templatesService.getTemplates()
      .subscribe((templates: Template[]) => {
        this.templates = templates;
        this.loading = false;
    });
  }

  getTemplates() {
    return this.templates;
  }

  get page(): number {
    return this.templatesService.page;
  }

  set page(value) {
    window.location.hash = '';
    window.location.hash = 'top';
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
