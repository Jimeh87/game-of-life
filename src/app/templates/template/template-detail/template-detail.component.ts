import {Component, Input, OnInit} from '@angular/core';
import {Template} from '../../template';

@Component({
  selector: 'app-template-detail',
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.css']
})
export class TemplateDetailComponent implements OnInit {

  @Input()
  private template: Template;

  constructor() { }

  ngOnInit() {
  }

  getTemplate() {
    return this.template;
  }

}
