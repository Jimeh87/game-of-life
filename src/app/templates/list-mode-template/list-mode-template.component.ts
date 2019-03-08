import {Component, Input, OnInit} from '@angular/core';
import {Template} from '../template';

@Component({
  selector: 'app-list-mode-template',
  templateUrl: './list-mode-template.component.html',
  styleUrls: ['./list-mode-template.component.css']
})
export class ListModeTemplateComponent implements OnInit {

  @Input()
  private template: Template;

  @Input()
  private theme = 'Preview';

  showDetails = false;

  constructor() {
  }

  ngOnInit() {
  }

  public getTemplate(): Template {
    return this.template;
  }

}
