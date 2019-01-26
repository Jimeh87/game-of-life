import {Component, OnDestroy, OnInit} from '@angular/core';
import {TemplatesService} from './templates.service';
import {Template} from './template';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit, OnDestroy {

  loading = true;
  filter = '';

  private templates: Template[];
  private subscription: Subscription;

  constructor(private templatesService: TemplatesService) {
  }

  ngOnInit() {
    this.subscription = this.templatesService.getTemplates()
      .subscribe((templates: Template[]) => {
        this.templates = templates;
        this.loading = false;
    });
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
