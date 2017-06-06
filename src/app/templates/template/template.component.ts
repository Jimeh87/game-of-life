import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Template} from '../template';
import {Subscription} from 'rxjs/Subscription';
import {GameOfLifeService} from '../../game-of-life.service';
import {Router} from '@angular/router';
import {ConfigService} from '../../config/config.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
  providers: [GameOfLifeService, ConfigService]
})
export class TemplateComponent implements OnInit {

  @Input()
  private template: Template;

  private showDetails = false;

  constructor(private gol: GameOfLifeService,
              private router: Router) { }

  ngOnInit(): void {
  }

  public isShowDetails(): boolean {
    return this.showDetails;
  }

  public toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  public getTemplate(): Template {
    return this.template;
  }

  public getTemplatePromise(): Promise<Template> {
    return new Promise<Template>((resolve) => resolve(this.template));
  }

}
