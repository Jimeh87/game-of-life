import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Author} from './author';
import {Cacheable} from 'ngx-cacheable';

@Injectable()
export class TypeaheadService {

  private AUTHOR_DATA = 'assets/parsed-authors.json';

  private VALID_TAGS: string[] = ['title', 'pattern', 'author'];


  constructor(private http: HttpClient) {
  }

  getTags(): string[] {
    return this.VALID_TAGS;
  }

  @Cacheable()
  getAuthors(): Observable<Author[]> {
    return this.http.get<any>(this.AUTHOR_DATA);
  }

}
