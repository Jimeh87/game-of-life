import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Rle} from './rle';
import {ArrayUtil} from '../algorithm/array-util';

@Injectable()
export class RleService { // TODO: Change to Asset or File service

  private RLE_DATA = '/assets/parsed-rle-data.json'; // TODO: Figure out how to make constant...

  constructor(private http: Http) {
  }

  public getRles(): Observable<Rle[]> {
    return this.http.request(this.RLE_DATA)
      .map((response: Response) => {
          const rleList: Rle[] = [];
          response.json().forEach((rleData) => {
              rleList.push(new Rle(rleData));
          });
          return rleList;
        }
      )
      .catch((error: Response) => {
        console.log('Error getting parsed rle: ', error);
        return Observable.throw('Error getting parsed rle: ' + error);
      });
  }



}
