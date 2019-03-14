import {Component, Input, OnInit} from '@angular/core';
import {Pattern} from '../pattern';
import {GameOfLifeService} from '../../game-of-life.service';
import {Router} from '@angular/router';
import {ConfigService} from '../../config/config.service';
import {PatternsService} from '../patterns.service';
import {ThemeService} from '../../config/theme.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PatternPreviewModalComponent} from '../pattern-preview-modal/pattern-preview-modal.component';

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.css'],
  providers: [GameOfLifeService, ConfigService, ThemeService]
})
export class PatternComponent implements OnInit {

  private patternPromise: Promise<Pattern> = new Promise<Pattern>((resolve) => resolve(this.pattern));

  @Input()
  preview = true;

  @Input()
  private pattern: Pattern;

  @Input()
  private rleFile: string;

  @Input()
  private theme = 'Preview';

  private showDetails = false;

  constructor(private gol: GameOfLifeService,
              private patternsService: PatternsService,
              private router: Router,
              private configService: ConfigService,
              private themeService: ThemeService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    if (this.rleFile != null) {
      this.patternPromise = this.patternsService.getPattern(this.rleFile).toPromise();
      this.patternPromise.then((pattern: Pattern) => {
        this.pattern = pattern;
      });
    }
    this.themeService.activeTheme = this.themeService.findTheme(this.theme);
  }

  public isShowDetails(): boolean {
    return this.showDetails;
  }

  public toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  public getPattern(): Pattern {
    return this.pattern;
  }

  public getPatternPromise(): Promise<Pattern> {
    return new Promise<Pattern>((resolve) => resolve(this.pattern));
  }

  openPreview() {
    const modalRef = this.modalService.open(PatternPreviewModalComponent, {
      centered: true,
      windowClass: 'pattern-preview-modal'
    });
    modalRef.componentInstance.pattern = this.pattern;
    modalRef.componentInstance.theme = this.themeService.activeTheme;
  }
}
