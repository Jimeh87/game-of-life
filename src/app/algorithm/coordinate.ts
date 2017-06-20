export class Coordinate<T> {
  constructor(private _x: number, private _y: number, private _value: T) {
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get value(): T {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
  }

  public hash(): string {
    return this.x + ',' + this.y;
  }
}
