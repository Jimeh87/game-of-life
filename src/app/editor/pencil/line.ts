export class Line {

  // Bresenham's Line Drawing Algorithm
  // https://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm#JavaScript
  public static draw(x0: number, y0: number, x1: number, y1: number, pixel: (x, y) => void): void {
    x0 = Math.trunc(x0);
    y0 = Math.trunc(y0);
    x1 = Math.trunc(x1);
    y1 = Math.trunc(y1);

    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    const dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2;

    while (true) {
      pixel(x0, y0);
      if (x0 === x1 && y0 === y1) {
        break;
      }
      const e2 = err;
      if (e2 > -dx) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dy) {
        err += dx;
        y0 += sy;
      }
    }
  }

}
