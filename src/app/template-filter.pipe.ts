import { Pipe, PipeTransform } from '@angular/core';
import {Template} from './templates/template';

@Pipe({
  name: 'templateFilter'
})
export class TemplateFilterPipe implements PipeTransform {

  transform(templates: Template[], filter: string): any {

    if (!templates || !filter || filter.length < 4) {
      return templates;
    }

    filter = filter.trim();
    const regex: RegExp = new RegExp(filter, 'i');
    return templates.filter((template: Template) => {
      if (template.getName().search(regex) !== -1) {
        return true;
      }
      if (template.getAuthor() != null && template.getAuthor().search(regex) !== -1) {
        return true;
      }
      if (template.getFileName().search(regex) !== -1) {
        return true;
      }
      if (filter.toUpperCase() === template.getRule().getFormattedRuleString()) {
        return true;
      }

      for (const comment in template.getComments()) {
        if (comment.search(regex) !== -1) {
          return true;
        }
      }
    });
  }

}
