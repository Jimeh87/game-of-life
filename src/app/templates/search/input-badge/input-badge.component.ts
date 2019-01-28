import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {TypeaheadService} from '../typeahead.service';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-input-badge',
  templateUrl: './input-badge.component.html',
  styleUrls: ['./input-badge.component.css']
})
export class InputBadgeComponent implements OnInit, AfterViewInit {

  @Input()
  tag: FormGroup;
  @Input()
  active = true;

  @ViewChild('typeahead')
  typeahead: NgbTypeahead;

  @ViewChild('tagInput')
  tagElementRef: ElementRef;

  constructor(private typeaheadService: TypeaheadService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.tagElementRef.nativeElement.focus();
  }

  autoComplete = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());

    switch (this.tag.get('key').value) {
      case 'rule':
        return debouncedText$
          .switchMap(term => this.typeaheadService.getRules().pipe(
            map(rules => rules
              .map(rule => rule.name)
              .filter(name => name.indexOf(term) > -1))
          ));
      case 'author':
        return debouncedText$.pipe(
          filter(term => term && term.length > 2))
          .switchMap(term => this.typeaheadService.getAuthors().pipe(
            map(authors => authors
              .map(author => author.display)
              .filter(author => author.toLowerCase().indexOf(term.toLowerCase()) > -1))
          ));
      default:
        return text$.pipe(
          map(() => [])
        );
    }
  }

}
