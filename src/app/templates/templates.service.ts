import {Injectable} from '@angular/core';
import {Template} from './template';
import {RleService} from './rle.service';
import {Rle} from './rle';
import {ArrayUtil} from '../algorithm/array-util';
import {Observable} from 'rxjs/index';
import {map} from 'rxjs/internal/operators';

@Injectable()
export class TemplatesService {

  private _page = 1;

  private templates: Observable<Template[]>;
  private templatesCache: Template[];

  constructor(private rleService: RleService) {
    this.templates = this.rleService.getRles().pipe(map((rleList: Rle[]) => {
      this.templatesCache = this.templatesCache || ArrayUtil.shuffle(rleList.map((rle: Rle) => new Template(rle)));
      return this.templatesCache;
    }));
  }

  public getTemplates(): Observable<Template[]> {
    return this.templates;
  }

  public getTemplate(rleFileName: string): Observable<Template> {
    return this.templates.pipe(map((templates: Template[]) =>
      templates.find((template: Template) => template.getFileName() === rleFileName)));
  }


  get page(): number {
    return this._page;
  }

  set page(value: number) {
    this._page = value;
  }
}
