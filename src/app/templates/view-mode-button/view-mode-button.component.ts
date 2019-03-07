import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ViewMode} from './view-mode.enum';
import {ConfigService} from '../../config/config.service';
import {ConfigType} from '../../config/config-type';

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
      name: 'Wide'
    }
  ];

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private configService: ConfigService) {
  }

  ngOnInit() {
    this.configService.getConfig(ConfigType.GAME_BOARD)
    this.formGroup = this.fb.group({
      mode: ViewMode.STANDARD
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
