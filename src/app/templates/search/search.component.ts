import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {debounceTime} from 'rxjs/operators';
import {TemplateQuery} from './template-query';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  private validTags: string[] = ['title', 'pattern'];

  private tagRegex = new RegExp('(' + this.validTags.join('|') + '*):', 'ig');

  @Output()
  query = new EventEmitter<TemplateQuery>();

  @ViewChild('searchBox')
  searchBox: ElementRef;

  form: FormGroup;

  private formValueChanged = new Subject<void>();

  private subs: Subscription[] = [];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      query: null,
      tags: this.fb.array([])
    });

    this.subs.push(this.form.get('query').valueChanges.subscribe(query => {
      let expressionResult;

      do {
        expressionResult = this.tagRegex.exec(query);
        if (expressionResult) {
          const newTag = this.fb.group({
            key: expressionResult[1].toLowerCase(),
            value: ''
          });
          (this.form.get('tags') as FormArray).push(newTag);

          this.subs.push(newTag.get('value').valueChanges.subscribe(() => this.formValueChanged.next()));
        }
      } while (expressionResult);

      this.form.get('query').patchValue(query.replace(this.tagRegex, ''), {emitEvent: false});

    }));

    this.subs.push(this.form.get('query').valueChanges.subscribe(() => this.formValueChanged.next()));

    this.subs.push(this.formValueChanged
      .pipe(debounceTime(500))
      .subscribe(() => this.query.next(Object.assign({}, this.form.value))));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

}
