import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Rle} from './rle';
import {ArrayUtil} from '../algorithm/array-util';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable()
export class RleService { // TODO: Change to Asset or File service

  private RLE_DATA = '/assets/parsed-rle-data.json'; // TODO: Figure out how to make constant...

  constructor(private http: HttpClient) {
  }

  public getRles(): Observable<Rle[]> {
    return this.http.get<any>(this.RLE_DATA)
      .pipe(map(rleData => rleData.map(datum => new Rle(datum))))
      .catch(error => {
        console.log('Error getting parsed rle data: ', error);
        return Observable.throw('Error getting parsed rle data: ' + error);
      });
  }


}
