import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {debounceTime, distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {switchMap} from "rxjs-compat/operator/switchMap";
import {TypeaheadService} from "../typeahead.service";

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-input-badge',
  templateUrl: './input-badge.component.html',
  styleUrls: ['./input-badge.component.css']
})
export class InputBadgeComponent implements OnInit, AfterViewInit {

  @Input()
  tag: FormGroup;

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
    switch (this.tag.get('key').value) {
      case 'title':
        return text$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          map(term => states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)));
      case 'author':
        return text$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          filter(term => term && term.length > 2))
          .switchMap(term => this.typeaheadService.getAuthors().pipe(
            map(authors => authors
              .map(author => author.display)
              .filter(author => author.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1))
          ));
      default:
        return text$.pipe(
          map(() => [])
        );
    }
  }

}
