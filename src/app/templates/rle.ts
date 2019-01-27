import {GolRule} from './gol-rule';
export class Rle {

  private readonly fileName: string;
  private rleString: string;
  private readonly name: string;
  private readonly author: string;
  private readonly pattern: string;
  private readonly rule: GolRule;
  private readonly comments: string[];
  private readonly boundingBox: { x: number, y: number };

  constructor(rleData: { filename: string,
                         name: string,
                         author: string,
                         rule: string,
                         comments: string[],
                         boundingBox: { x: number, y: number },
                         pattern: string }) {
    this.fileName = rleData.filename;
    this.name = rleData.name;
    this.author = rleData.author;
    this.rule = new GolRule(rleData.rule);
    this.comments = rleData.comments;
    this.boundingBox = rleData.boundingBox;
    this.pattern = rleData.pattern;
  }

  public getFileName(): string {
    return this.fileName;
  }

  public getName(): string {
    return this.name;
  }

  public getAuthor(): string {
    return this.author;
  }

  public getRule(): GolRule {
    return this.rule;
  }

  public getComments(): string[] {
    return this.comments;
  }

  public getPattern(): string {
    return this.pattern;
  }

  public getBoundingBox(): { x: number, y: number } {
    return this.boundingBox;
  }

  // TODO: this can be faster.. ditch regex and do '!' last
  public toBlueprint(): { x: number, y: number }[] {
    const blueprint: { x: number, y: number }[] = [];
    const rlePattern: string = this.getPattern();
    let done = false;
    let index = 0;
    let y = 0;
    let x = -1;
    while (done !== true) {
      const subRlePattern = rlePattern.substr(index, rlePattern.length);
      if (subRlePattern[0] === '!') {
        // end of pattern
        done = true;
        continue;
      }

      const match: RegExpExecArray = /^[0-9]*(b|o|\$)/.exec(subRlePattern);
      if (match != null) {
        const part = match[0];
        let count = 1;
        if (part.length !== 1) {
          count = +part.substr(0, part.length - 1);
        }
        if (part[part.length - 1] === 'b') { // dead cell
          x = x + count;
        } else if (part[part.length - 1] === 'o') { // alive cell
          for (let i = 0; i < count; i++) {
            x++;
            blueprint.push({x: x, y: y});
          }
        } else if (part[part.length - 1] === '$') { // new line
          y = y + count;
          x = -1;
        } else {
          console.log('Parse failure: ' + subRlePattern + ' on part ' + part);
          done = true;
        }
        index = index + part.length;
      } else {
        console.log('Parse failure: ' + subRlePattern);
        done = true;
      }
    }
    return blueprint;
  }

  /*
   * @deprecated - Parsed in grunt task now
   */
  private parsePatternFromRle(): string {
    const pattern: string = /\n([0-9]|b|o|\$|\s|\n)*!/.exec(this.rleString)[0].replace(/\r?\n|\r|\s/g, '');
    return pattern;
  }

  /*
   * @deprecated - Parsed in grunt task now
   */
  private parseRuleFromRle(): string {
    const rule: string = /rule\s?\=\s?(B|S|b|s)?[0-9]+\/(B|S|b|s)?[0-9]+/.exec(this.rleString)[0]
      .replace(/\r?\n|\r|\s/g, '').replace(/rule=/, '');
    return rule;
  }

  /*
   * @deprecated - Parsed in grunt task now
   */
  private parseCommentsFromRle(): string[] {
    const comments: string[] = [];
    const pattern: RegExp = /#(C|c)\s?[^\n]*/g;
    let execArray: RegExpExecArray;
    while (execArray = pattern.exec(this.rleString)) {
      comments.push(execArray[0].replace(/#C\s?/g, '').replace(/^(?!http:\/\/)www\./g, 'http://www.'));
    }
    return comments;
  }

  /*
   * @deprecated - Parsed in grunt task now
   */
  private parseBoundingBoxFromRle(): { x: number, y: number } {
    const boundingBox: { x: number, y: number } = {x: null, y: null};
    boundingBox['x'] = 1;
    const findLinePattern: RegExp = /(?!#C)x\s?\=\s?[0-9]+,\s?y\s?\=\s?[0-9]+/i;
    const xyLine = findLinePattern.exec(this.rleString)[0].replace(/[^0-9xXyY]/g, '');
    let xyValue = '';
    let leadingCharacter: string = null;
    for (let i = 0; i < xyLine.length; i++) {
      const char: string = xyLine[i];
      if (char === 'x' || char === 'X' || char === 'y' || char === 'Y') {
        if (leadingCharacter != null) {
          boundingBox[leadingCharacter] = +xyValue;
          xyValue = '';
        }
        leadingCharacter = char.toLowerCase();
      } else {
        xyValue += char;
      }
    }
    boundingBox[leadingCharacter] = +xyValue;
    return boundingBox;
  }

  /*
   * @deprecated - Parsed in grunt task now
   */
  private parseNameFromRle(): string {
    let name: string;
    const execArray: RegExpExecArray = /#N\s?[^\n]*/.exec(this.rleString);
    if (execArray != null) {
      name = execArray[0].replace(/#N\s?/g, '').trim();
    } else {
      name = this.fileName.slice(0, -4);
    }
    return name;
  }

  /*
   * @deprecated - Parsed in grunt task now
   */
  private parseAuthorFromRle(): string {
    const execArray: RegExpExecArray = /#O\s?[^\n]*/.exec(this.rleString);
    if (execArray != null) {
      return execArray[0].replace(/#O\s?/g, '').trim();
    }
    return null;
  }

}
