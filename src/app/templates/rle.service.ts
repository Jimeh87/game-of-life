import 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {Rle} from './rle';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/index';

@Injectable()
export class RleService { // TODO: Change to Asset or File service

  private RLE_DATA = '/assets/parsed-rle-data.json'; // TODO: Figure out how to make constant...

  constructor(private http: HttpClient) {
  }

  public getRles(): Observable<Rle[]> {
    return this.http.get<any>(this.RLE_DATA).pipe(map(rleData => rleData.map(datum => new Rle(datum))));
  }


}
