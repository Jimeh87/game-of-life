import {Injectable} from '@angular/core';
import {GameOfLifeService} from '../game-of-life.service';
import {Template} from './template';
import {Observable} from 'rxjs/Observable';
import {RleService} from './rle.service';
import {Rle} from './rle';
import {ArrayUtil} from '../algorithm/array-util';

@Injectable()
export class TemplatesService {

  private _page = 1;

  private templates: Observable<Template[]>;
  private templatesCache: Template[];

  constructor(private rleService: RleService) {
    this.templates = this.rleService.getRles().map((rleList: Rle[]) => {
      if (this.templatesCache == null) {
        this.templatesCache = ArrayUtil.shuffle(rleList.map((rle: Rle) => new Template(rle)));
      }
      return this.templatesCache;
    });
  }

  public getTemplates(): Observable<Template[]> {
    return this.templates;
  }

  public getTemplate(rleFileName: string): Observable<Template> {
    return this.templates.map((templates: Template[]) => {
      return templates.find((template: Template) => template.getFileName() === rleFileName);
    });
  }


  get page(): number {
    return this._page;
  }

  set page(value: number) {
    this._page = value;
  }
}
