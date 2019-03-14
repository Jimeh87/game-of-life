import {Component, Input} from '@angular/core';
import {Pattern} from '../../pattern';

@Component({
  selector: 'app-pattern-detail',
  templateUrl: './pattern-detail.component.html',
  styleUrls: ['./pattern-detail.component.css']
})
export class PatternDetailComponent {

  @Input()
  private pattern: Pattern;

  getPattern() {
    return this.pattern;
  }

}
