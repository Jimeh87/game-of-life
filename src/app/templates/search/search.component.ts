import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {merge} from 'rxjs';
import {TemplateQuery} from './template-query';
import {Subject} from 'rxjs/Subject';
import {TypeaheadService} from './typeahead.service';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  private tagRegex = new RegExp('(' + this.typeaheadService.getTags().join('|') + '*):', 'ig');

  @Output()
  query = new EventEmitter<TemplateQuery>();

  @ViewChild('searchBox')
  searchBox: ElementRef;

  @ViewChild('typeahead')
  typeahead: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  form: FormGroup;

  private formValueChanged = new Subject<void>();

  private subs: Subscription[] = [];

  constructor(private fb: FormBuilder, private typeaheadService: TypeaheadService) {
  }

  ngOnInit() {
    this.createForm();
    this.wireTagCreation();
    this.monitorFormChanges();
  }

  private createForm() {
    this.form = this.fb.group({
      query: null,
      tags: this.fb.array([])
    });
  }

  private wireTagCreation() {
    this.subs.push(this.form.get('query').valueChanges.subscribe(query => {
      if (this.createTagOnMatch(query)) {
        this.typeahead.dismissPopup();
        this.form.get('query').patchValue(query.replace(this.tagRegex, ''));
      }
    }));
  }

  private monitorFormChanges() {
    this.subs.push(this.form.get('query').valueChanges.subscribe(() => this.formValueChanged.next()));
    this.subs.push(this.formValueChanged
      .pipe(debounceTime(500))
      .subscribe(() => this.query.next(Object.assign({}, this.form.value))));
  }

  private createTagOnMatch(query: string): boolean {
    let tagCreated = false;
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
        tagCreated = true;
      }
    } while (expressionResult);

    return tagCreated;
  }

  autoComplete = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.typeahead.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term =>
        this.typeaheadService.getTags()
          .filter(v => term ? v.toLowerCase().indexOf(term.toLowerCase()) > -1 : true)
          .map(t => t + ':')
          .slice(0, 10)));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

}
