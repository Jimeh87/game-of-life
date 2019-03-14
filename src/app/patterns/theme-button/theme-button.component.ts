import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfigService} from '../../config/config.service';
import {PatternsConfig} from '../../config/patterns-config';
import {ConfigType} from '../../config/config-type';
import {ThemeService} from '../../config/theme.service';

@Component({
  selector: 'app-theme-button',
  templateUrl: './theme-button.component.html',
  styleUrls: ['./theme-button.component.css']
})
export class ThemeButtonComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private configService: ConfigService, private themeService: ThemeService) {
  }

  ngOnInit() {
    const patternsConfig: PatternsConfig = <PatternsConfig>this.configService.getConfig(ConfigType.PATTERNS);
    this.formGroup = this.fb.group({
      theme: patternsConfig.theme
    });
    this.formGroup.get('theme').valueChanges.subscribe(v => {
      patternsConfig.theme = v;
    });
  }

  getActive() {
    return this.formGroup.get('theme').value;
  }

  getThemes() {
    return this.themeService.themes;
  }

  setTheme(themeName: string) {
    this.formGroup.get('theme').patchValue(themeName);
  }
}
