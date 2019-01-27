import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';

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

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.tagElementRef.nativeElement.focus();
  }

}
