import {Pattern} from './pattern';
import {PatternQuery} from './search/pattern-query';
import {Observable, of} from 'rxjs';

export class QueryProcessor {

  private static minTagLength = 3;
  private static minQueryLength = 4;

  public static process(patterns: Pattern[], patternQuery: PatternQuery): Observable<Pattern[]> {
    return of(this.processSync(patterns, patternQuery));
  }

  private static processSync(patterns: Pattern[], patternQuery: PatternQuery): Pattern[] {
    if (!this.allowSearch(patterns, patternQuery)) {
      return patterns;
    }

    const filter = patternQuery.query ? patternQuery.query.trim() : '';
    const regex: RegExp = new RegExp(filter, 'i');
    return patterns.filter((pattern: Pattern) => {
      return this.titleTagMatch(pattern, patternQuery)
        && this.patternTagMatch(pattern, patternQuery)
        && this.authorTagMatch(pattern, patternQuery)
        && this.ruleTagMatch(pattern, patternQuery)
        && this.categoryTagMatch(pattern, patternQuery)
        && this.genericMatch(filter, regex, pattern);
    });
  }

  private static allowSearch(patterns: Pattern[], patternQuery: PatternQuery): boolean {
    return !!patterns && !!patternQuery;
  }

  private static titleTagMatch(pattern: Pattern, patternQuery: PatternQuery): boolean {
    return this.tagMatch<string>(
      patternQuery,
      'title',
      pattern.getName(),
      (t: string, tag: string) => t.search(new RegExp(tag, 'i')) !== -1);
  }

  private static patternTagMatch(pattern: Pattern, patternQuery: PatternQuery): boolean {
    return this.tagMatch<string>(
      patternQuery,
      'pattern',
      pattern.getPattern(),
      (patternValue, tagValue) => patternValue.includes(tagValue));
  }

  private static ruleTagMatch(pattern: Pattern, patternQuery: PatternQuery): boolean {
    return this.tagMatch<string>(
      patternQuery,
      'rule',
      pattern.getRule().getFormattedRuleString(),
      (patternValue, tagValue) => patternValue.includes(tagValue.toUpperCase()));
  }

  private static authorTagMatch(pattern: Pattern, patternQuery: PatternQuery): boolean {
    return this.tagMatch<string>(
      patternQuery,
      'author',
      pattern.getAuthor(),
      (patternValue, tagValue) => {
        if (!patternValue) {
          return !tagValue;
        }
        let allMatch = true;
        for (const name of tagValue.split(' ').filter(v => v)) {
          if (!patternValue.toLowerCase().includes(name.toLowerCase())) {
            allMatch = false;
          }
        }
        return allMatch;
      });
  }

  private static categoryTagMatch(pattern: Pattern, patternQuery: PatternQuery): boolean {
    return this.tagMatch<string[]>(
      patternQuery,
      'category',
      pattern.getCategories(),
      (patternValue, tagValue) => !!patternValue.filter(v => v.indexOf(tagValue.toLowerCase()) > -1).length);
  }

  private static tagMatch<T>(patternQuery: PatternQuery,
                             key: string,
                             patternValue: T,
                             equalityFn: (patternValue: T, tagValue: string) => boolean): boolean {
    const tagValues = patternQuery.tags
      .filter(t => t.key === key)
      .filter(t => t.value.length >= this.minTagLength)
      .map(t => t.value.trim());
    let tagMatched: boolean = !tagValues.length;
    for (const tagValue of tagValues) {
      if (equalityFn(patternValue, tagValue)) {
        tagMatched = true;
      }
    }

    return tagMatched;
  }

  private static genericMatch(filter: string, filterRegex: RegExp, pattern: Pattern) {
    if (!filter || filter.length < this.minQueryLength) {
      return true;
    }

    if (pattern.getName().search(filterRegex) !== -1) {
      return true;
    }
    if (pattern.getAuthor() != null && pattern.getAuthor().search(filterRegex) !== -1) {
      return true;
    }
    if (pattern.getFileName().search(filterRegex) !== -1) {
      return true;
    }
    if (pattern.getRule().getFormattedRuleString().search(filterRegex) !== -1) {
      return true;
    }
    if (filter.toUpperCase() === pattern.getRule().getFormattedRuleString()) {
      return true;
    }
    if (pattern.getComments().join(' ').search(filterRegex) !== -1) {
      return true;
    }
    if (!!pattern.getCategories().filter(v => v.indexOf(filter.toLowerCase()) > -1).length) {
      return true;
    }

    return false;
  }

}
