export class Generation {
  private _generation = 0;

  constructor(private _value: number) {
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
    this._generation++;
  }

  get generation(): number {
    return this._generation;
  }

}
