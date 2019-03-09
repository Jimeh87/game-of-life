import {Component, Input, OnInit} from '@angular/core';
import {Template} from '../template';
import {TemplatePreviewModalComponent} from '../template-preview-modal/template-preview-modal.component';
import {ThemeService} from '../../config/theme.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-mode-template',
  templateUrl: './list-mode-template.component.html',
  styleUrls: ['./list-mode-template.component.css']
})
export class ListModeTemplateComponent implements OnInit {

  @Input()
  private template: Template;

  @Input()
  private theme = 'Preview';

  showDetails = false;

  constructor(private themeService: ThemeService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  public getTemplate(): Template {
    return this.template;
  }

  openPreview() {
    const modalRef = this.modalService.open(TemplatePreviewModalComponent, {
      centered: true,
      windowClass: 'template-preview-modal'
    });
    modalRef.componentInstance.template = this.template;
    modalRef.componentInstance.theme = this.themeService.activeTheme;
  }

}
