import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Author} from './author';
import {Cacheable} from 'ngx-cacheable';
import {Rule} from './rule';
import {Category} from "./category";

@Injectable()
export class TypeaheadService {

  private AUTHOR_DATA = 'assets/parsed-authors.json';
  private CATEGORY_DATA = 'assets/parsed-categories.json';
  private RULE_DATA = 'assets/parsed-rules.json';


  private VALID_TAGS: string[] = ['author', 'category', 'pattern', 'rule', 'title'];


  constructor(private http: HttpClient) {
  }

  getTags(): string[] {
    return this.VALID_TAGS;
  }

  @Cacheable()
  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.AUTHOR_DATA);
  }

  @Cacheable()
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.CATEGORY_DATA);
  }


  @Cacheable()
  getRules(): Observable<Rule[]> {
    return this.http.get<Rule[]>(this.RULE_DATA);
  }

}
