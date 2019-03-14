import {Component, Input} from '@angular/core';
import {Pattern} from '../pattern';
import {PatternPreviewModalComponent} from '../pattern-preview-modal/pattern-preview-modal.component';
import {ThemeService} from '../../config/theme.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-mode-pattern',
  templateUrl: './list-mode-pattern.component.html',
  styleUrls: ['./list-mode-pattern.component.css']
})
export class ListModePatternComponent {

  @Input()
  private pattern: Pattern;

  @Input()
  private theme = 'Preview';

  showDetails = false;

  constructor(private themeService: ThemeService,
              private modalService: NgbModal) {
  }

  public getPattern(): Pattern {
    return this.pattern;
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
