import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  @Output()
  query = new EventEmitter<string>();

  form: FormGroup;

  private sub: Subscription;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      query: ''
    });

    this.sub = this.form.get('query').valueChanges
      .pipe(debounceTime(200))
      .subscribe(q => this.query.next(q));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


}
