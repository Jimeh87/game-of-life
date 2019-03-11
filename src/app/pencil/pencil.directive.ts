import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';
import {Line} from '../algorithm/line';

@Directive({
  selector: '[appPencil]'
})
export class PencilDirective {
  @Output('appPencil')
  pencilPositionEvent = new EventEmitter<{ x: number, y: number }>();

  @Output()
  pencilUp = new EventEmitter<void>();

  private _mouseDown = false;

  private get mouseDown(): boolean {
    return this._mouseDown;
  }

  private set mouseDown(value: boolean) {
    if (!value) {
      this.lastPosition = null;
      this.pencilUp.next();
    }
    this._mouseDown = value;
  }

  private canvasRef: ElementRef;
  private canvas: HTMLCanvasElement;
  private lastPosition: { x: number, y: number };

  constructor(canvasRef: ElementRef) {
    this.canvasRef = canvasRef;
    this.canvas = this.canvasRef.nativeElement;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.mouseDown = false;
    return false;
  }

  @HostListener('mousedown', ['$event'])
  private onMouseDown(event: MouseEvent) {
    this.mouseDown = true;
    this.updatePencilPosition(event);
    return false;
  }

  @HostListener('mouseup')
  private onMouseUp() {
    this.mouseDown = false;
    return false;
  }

  @HostListener('mousemove', ['$event'])
  private onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      this.updatePencilPosition(event);
    }
    return false;
  }

  @HostListener('touchstart', ['$event'])
  private onTouchStart(event: TouchEvent) {
    this.mouseDown = true;
    this.updatePencilPosition(event);
    event.stopPropagation();
    return false;
  }

  @HostListener('touchmove', ['$event'])
  private onTouchMove(event: TouchEvent) {
    if (this.mouseDown) {
      this.updatePencilPosition(event);
    }
    event.stopPropagation();
    return false;
  }

  @HostListener('touchend', ['$event'])
  private onTouchEnd(event: MouseEvent) {
    this.mouseDown = false;
    event.stopPropagation();
    return false;
  }

  @HostListener('click')
  private onClick() {
    return false;
  }

  private updatePencilPosition(event: MouseEvent | TouchEvent): void {
    const currentPosition = this.getMousePosition(event);
    const emitFn = (x, y) => this.pencilPositionEvent.emit({x: x, y: y});
    if (this.lastPosition) {
      Line.draw(
        this.lastPosition.x, this.lastPosition.y,
        currentPosition.x, currentPosition.y,
        emitFn
      );
    } else {
      emitFn(currentPosition.x, currentPosition.y);
    }
    this.lastPosition = currentPosition;
  }

  private getMousePosition(event: MouseEvent | TouchEvent): { x: number, y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (this.getClientX(event) - rect.left) / (rect.right - rect.left) * this.canvas.width,
      y: (this.getClientY(event) - rect.top) / (rect.bottom - rect.top) * this.canvas.height
    };
  }

  private getClientX(event: MouseEvent | TouchEvent) {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  private getClientY(event: MouseEvent | TouchEvent) {
    return event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  }


}
