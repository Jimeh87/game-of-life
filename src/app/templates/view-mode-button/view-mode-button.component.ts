import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ViewMode} from './view-mode.enum';

@Component({
  selector: 'app-view-mode-button',
  templateUrl: './view-mode-button.component.html',
  styleUrls: ['./view-mode-button.component.css']
})
export class ViewModeButtonComponent implements OnInit {

  @Output()
  mode = new EventEmitter<ViewMode>();

  viewModes = [
    {
      key: ViewMode.STANDARD,
      name: 'Standard'
    },
    {
      key: ViewMode.WIDE,
      name: 'Full Width'
    }
  ];

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      mode: ViewMode.WIDE
    });
    this.mode.emit(this.formGroup.get('mode').value);
    this.formGroup.get('mode').valueChanges.subscribe(v => this.mode.emit(v));
  }

  getActive() {
    return this.viewModes.find(m => m.key === this.formGroup.get('mode').value).name;
  }

  setMode(key: ViewMode) {
    this.formGroup.get('mode').patchValue(key);
  }
}
