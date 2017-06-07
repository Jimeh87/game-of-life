import {Component, ElementRef, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {TemplatesService} from './templates.service';
import {Template} from './template';
import {Subscription} from 'rxjs/Subscription';
import {PageScrollInstance, PageScrollService} from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/platform-browser';

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

  constructor(private templatesService: TemplatesService,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any) {
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
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#templatesTop');
    this.pageScrollService.start(pageScrollInstance);
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
