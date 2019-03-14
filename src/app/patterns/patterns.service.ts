import {Injectable} from '@angular/core';
import {Pattern} from './pattern';
import {RleService} from './rle.service';
import {Rle} from './rle';
import {ArrayUtil} from '../util/array-util';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class PatternsService {

  private _page = 1;

  private readonly patterns$ = this.rleService.getRles()
    .pipe(map((rleList: Rle[]) => rleList.map((rle: Rle) => new Pattern(rle))));

  constructor(private rleService: RleService) {
  }

  public getPatterns(): Observable<Pattern[]> {
    return this.patterns$;
  }

  public getPattern(rleFileName: string): Observable<Pattern> {
    return this.patterns$.pipe(map((patterns: Pattern[]) =>
      patterns.find((pattern: Pattern) => pattern.getFileName() === rleFileName)));
  }


  get page(): number {
    return this._page;
  }

  set page(value: number) {
    this._page = value;
  }
}
