import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {TemplatesService} from './templates.service';
import {Template} from './template';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit, OnChanges, OnDestroy {

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['_filter'] != null && changes['_filter'].currentValue !== changes['_filter'].previousValue) {
    }
  }

  toTemplatesTop() {
    window.scroll(0, 0);
  }

  getTemplates() {
    return this.templates;
  }

  get page(): number {
    return this.templatesService.page;
  }

  set page(value) {
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
