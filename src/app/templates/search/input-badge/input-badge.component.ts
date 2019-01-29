import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {TypeaheadService} from '../typeahead.service';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {Author} from '../author';
import {Category} from '../category';
import {Rule} from '../rule';

@Component({
  selector: 'app-input-badge',
  templateUrl: './input-badge.component.html',
  styleUrls: ['./input-badge.component.css']
})
export class InputBadgeComponent implements OnInit, AfterViewInit {

  @Input()
  tag: FormGroup;
  @Input()
  index: number;
  @Input()
  active = true;
  @Output()
  complete = new EventEmitter<FormGroup>();
  @Output()
  remove = new EventEmitter<number>();

  @ViewChild('typeahead')
  typeahead: NgbTypeahead;

  @ViewChild('tagInput')
  tagElementRef: ElementRef;

  private enterKey = 13;

  constructor(private typeaheadService: TypeaheadService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.tag.get('active').value) {
      this.tagElementRef.nativeElement.focus();
    }
  }

  keyPressed($event: KeyboardEvent) {
    if ($event.keyCode === this.enterKey) {
      this.tag.get('active').patchValue(false);
      this.complete.next(this.tag);
    }
  }

  removeTag() {
    this.remove.next(this.index);
  }

  autoComplete = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    switch (this.tag.get('key').value) {
      case 'author':
        return debouncedText$.pipe(
          switchMap(term => this.typeaheadService.getAuthors().pipe(
            map((authors: Author[]) => authors
              .map(author => author.display)
              .filter(author => !author || author.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))));
      case 'category':
        return debouncedText$.pipe(
          switchMap(term => this.typeaheadService.getCategories().pipe(
            map((categories: Category[]) => categories
              .map(category => category.name)
              .filter(category => !category || category.indexOf(term.toLowerCase()) > -1).slice(0, 10)))));
      case 'rule':
        return debouncedText$.pipe(
          switchMap(term => this.typeaheadService.getRules().pipe(
            map((rules: Rule[]) => rules
              .map(rule => rule.name)
              .filter(name => !name || name.indexOf(term) > -1).slice(0, 10)))));
      default:
        return text$.pipe(
          map(() => [])
        );
    }
  }

}
