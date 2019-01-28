import {Pipe, PipeTransform} from '@angular/core';
import {Template} from './templates/template';
import {TemplateQuery} from './templates/search/template-query';

@Pipe({
  name: 'templateFilter'
})
export class TemplateFilterPipe implements PipeTransform {

  private minTagLength = 3;
  private minQueryLength = 4;

  transform(templates: Template[], templateQuery: TemplateQuery): any {
    console.log(templateQuery);
    if (!this.allowSearch(templates, templateQuery)) {
      return templates;
    }

    const filter = templateQuery.query.trim();
    const regex: RegExp = new RegExp(filter, 'i');
    return templates.filter((template: Template) => {
      return this.titleTagMatch(template, templateQuery)
        && this.patternTagMatch(template, templateQuery)
        && this.authorTagMatch(template, templateQuery)
        && this.ruleTagMatch(template, templateQuery)
        && this.genericMatch(filter, regex, template);
    });
  }

  private allowSearch(templates: Template[], templateQuery: TemplateQuery): boolean {
    return !!templates && !!templateQuery;
  }

  private titleTagMatch(template: Template, templateQuery: TemplateQuery): boolean {
    return this.tagMatch(templateQuery, 'title', template.getName());
  }

  private patternTagMatch(template: Template, templateQuery: TemplateQuery): boolean {
    return this.tagMatch(
      templateQuery,
      'pattern',
      template.getPattern(),
      (templateValue, tagValue) => templateValue.includes(tagValue));
  }

  private ruleTagMatch(template: Template, templateQuery: TemplateQuery): boolean {
    return this.tagMatch(
      templateQuery,
      'rule',
      template.getRule().getFormattedRuleString(),
      (templateValue, tagValue) => templateValue.includes(tagValue.toUpperCase()));
  }

  private authorTagMatch(template: Template, templateQuery: TemplateQuery): boolean {
    return this.tagMatch(
      templateQuery,
      'author',
      template.getAuthor(),
      (templateValue, tagValue) => {
        if (!templateValue) {
          return !tagValue;
        }
        let allMatch = true;
        for (const name of tagValue.split(' ').filter(v => v)) {
          if (!templateValue.toLowerCase().includes(name.toLowerCase())) {
            allMatch = false;
          }
        }
        return allMatch;
      });
  }

  private tagMatch(templateQuery: TemplateQuery,
                   key: string,
                   templateValue: string,
                   equalityFn?: (templateValue: string, tagValue: string) => boolean): boolean {
    equalityFn = equalityFn || ((t: string, tag: string) => t.search(new RegExp(tag, 'i')) !== -1);
    const tagValues = templateQuery.tags
      .filter(t => t.key === key)
      .filter(t => t.value.length >= this.minTagLength)
      .map(t => t.value.trim());
    let tagMatched: boolean = !tagValues.length;
    for (const tagValue of tagValues) {
      if (equalityFn(templateValue, tagValue)) {
        tagMatched = true;
      }
    }

    return tagMatched;
  }

  private genericMatch(filter: string, filterRegex: RegExp, template: Template) {
    if (!filter || filter.length < this.minQueryLength) {
      return true;
    }

    if (template.getName().search(filterRegex) !== -1) {
      return true;
    }
    if (template.getAuthor() != null && template.getAuthor().search(filterRegex) !== -1) {
      return true;
    }
    if (template.getFileName().search(filterRegex) !== -1) {
      return true;
    }
    if (template.getRule().getFormattedRuleString().search(filterRegex) !== -1) {
      return true;
    }
    if (filter.toUpperCase() === template.getRule().getFormattedRuleString()) {
      return true;
    }
    if (template.getComments().join(' ').search(filterRegex) !== -1) {
      return true;
    }

    return false;
  }

}
