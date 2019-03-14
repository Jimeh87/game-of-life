import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ViewMode} from './view-mode.enum';
import {ConfigService} from '../../config/config.service';
import {ConfigType} from '../../config/config-type';
import {PatternsConfig} from '../../config/patterns-config';

@Component({
  selector: 'app-view-mode-button',
  templateUrl: './view-mode-button.component.html',
  styleUrls: ['./view-mode-button.component.css']
})
export class ViewModeButtonComponent implements OnInit {

  viewModes = [
    {
      key: ViewMode.LIST,
      name: 'List'
    },
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
    const patternsConfig: PatternsConfig = <PatternsConfig>this.configService.getConfig(ConfigType.PATTERNS);
    this.formGroup = this.fb.group({
      mode: patternsConfig.viewMode
    });
    this.formGroup.get('mode').valueChanges.subscribe(v => {
      patternsConfig.viewMode = v;
    });
  }

  getActive() {
    return this.viewModes.find(m => m.key === this.formGroup.get('mode').value).name;
  }

  setMode(key: ViewMode) {
    this.formGroup.get('mode').patchValue(key);
  }
}
