import {Component, OnDestroy, OnInit} from '@angular/core';
import {TemplatesService} from './templates.service';
import {Template} from './template';
import {Subscription} from 'rxjs';
import {TemplateQuery} from './search/template-query';
import {QueryProcessor} from "./query-processor";
import {take, tap} from "rxjs/operators";

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit, OnDestroy {

  loading = true;
  templateQuery: TemplateQuery;

  private templates: Template[];
  filteredTemplates: Template[];
  private subscription: Subscription;

  constructor(private templatesService: TemplatesService) {
  }

  ngOnInit() {
    this.subscription = this.templatesService.getTemplates()
      .subscribe((templates: Template[]) => {
        this.templates = templates;
        this.filteredTemplates = this.templates;
        this.loading = false;
      });
  }

  queryChanged(templateQuery: TemplateQuery) {
    this.templateQuery = templateQuery;
    this.loading = true;
    QueryProcessor.process(this.templates, templateQuery)
      .pipe(take(1))
      .subscribe(templates => {
        this.filteredTemplates = templates;
        this.loading = false;
      });
  }

  toTemplatesTop() {
    window.scroll(0, 0);
  }

  get page(): number {
    return this.templatesService.page;
  }

  set page(value) {
    this.templatesService.page = value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
