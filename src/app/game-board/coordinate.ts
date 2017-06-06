export class Coordinate {

  public static fromHash(hash: string): Coordinate {
    const xy: string[] = hash.split(',');
    return new Coordinate(+xy[0], +xy[1]);
  }

  constructor(private x: number,
              private y: number) {
  };

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public hash(): string {
    return this.x + ',' + this.y; // FIXME: Probably a better way to do this
  }

}
