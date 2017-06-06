import {SortedSet} from '../algorithm/sorted-set';
export class GolRule {

  survival: SortedSet<number> = new SortedSet((a: number, b: number) => { return a - b; });
  birth: SortedSet<number> = new SortedSet((a: number, b: number) => { return a - b; });

  constructor(private ruleString) {
    this.parseRuleString();
  }

  private parseRuleString() {
    let selectedRuleSet: SortedSet<number> = this.survival;
    for (let i = 0; i < this.ruleString.length; i++) {
      const char: string = this.ruleString[i];
      if (char >= '0' && char <= '9') {
        selectedRuleSet.add(+char);
      } else if (char === 'S' || char === 's') {
        selectedRuleSet = this.survival;
      } else if (char === 'B' || char === 'b') {
        selectedRuleSet = this.birth;
      } else if (char === '/') {
        selectedRuleSet = this.birth;
      } else {
        throw new Error('Index: ' + i + ' Unknown character: ' + char + ' on rule string: ' + this.ruleString);
      }
    }
  }

  public getRuleString() {
    return this.ruleString;
  }

  public getFormattedRuleString() {
    let formattedRuleString = 'B';
    this.birth.forEach((n: number) => {
      formattedRuleString += n;
    });
    formattedRuleString += '/S';
    this.survival.forEach((n: number) => {
      formattedRuleString += n;
    });
    return formattedRuleString;
  }

  public isAliveNextGeneration(currentState: boolean, neighbours: number): boolean {
    return (currentState && this.survival.has(neighbours)) || (!currentState && this.birth.has(neighbours));;
  }
}
