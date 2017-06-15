import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {GameOfLifeService} from 'app/game-of-life.service';
import {Subscription} from 'rxjs/Subscription';
import {Template} from '../templates/template';
import {Observable} from 'rxjs/Observable';
import {ConfigService} from '../config/config.service';
import {GameBoardConfig} from '../config/game-board-config';
import {ConfigType} from '../config/config-type';
import {GameBoardStyleConfig} from '../config/game-board-style-config';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input()
  private preview = false;

  @Input()
  private template: Promise<Template>;

  @Input()
  private fullScreen = false;

  @ViewChild('golCanvas') canvasRef: ElementRef;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private mouseDown = false;
  private lastSelectedCell: {x: number, y: number} = null;

  private gbConfig: GameBoardConfig;
  private gbStyleConfig: GameBoardStyleConfig;

  private cellStateSubscription: Subscription;

  private gameBoardConfigSubscription: Subscription;

  constructor(private gameOfLifeService: GameOfLifeService,
              private ngZone: NgZone,
              private configService: ConfigService) {
  }

  ngOnInit() {
    this.gbConfig = <GameBoardConfig> this.configService.getConfig(ConfigType.GAME_BOARD);
    this.gbStyleConfig = <GameBoardStyleConfig> this.configService.getConfig(ConfigType.GAME_BOARD_STYLE);
  }

  ngAfterViewInit() {
    this.initCanvas();
    this.canvasFillContainer();

    this.drawWorld();
    this.cellStateSubscription = this.gameOfLifeService.getCellStateObservable().subscribe(
      (cell: { x: number, y: number, state: boolean }) => {
        if (cell.x < this.gbConfig.columns + this.gbConfig.xScreenOffset && cell.y < this.gbConfig.rows + this.gbConfig.yScreenOffset) {
          this.drawCell(cell.x - this.gbConfig.xScreenOffset, cell.y - this.gbConfig.yScreenOffset, cell.state);
        }
      }
    );

    this.gbConfig.refreshable = false;
    if (this.template != null) {
      this.template.then((template: Template) => {
        this.canvasFillContainer();
        this.canvasFitToBoundingBox(template.getBoundingBox());
        this.drawWorld();
        this.gameOfLifeService.applyTemplate(
          template,
          this.gbConfig.columns,
          this.gbConfig.rows
        );
        this.gbConfig.refreshable = true;
      });
    } else {
      this.gameOfLifeService.clearTemplate();
    }

    this.gameBoardConfigSubscription = this.gbConfig.observe.subscribe(() => {
      this.canvasFillContainer();
      this.drawWorld();
    });

    this.ngZone.runOutsideAngular(() => {
      Observable.fromEvent(window, 'resize')
        .throttleTime(100)
        .subscribe(() => {
          this.onScreenResize();
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fullScreen'] != null && !changes['fullScreen'].firstChange
      && changes['fullScreen'].currentValue !== changes['fullScreen'].previousValue) {
      this.onScreenResize();
    }
  }

  onScreenResize() {
    if (this.preview) {
      return;
    }
    this.canvasFillContainer();
    this.drawWorld();
  }

  initCanvas() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');
  }

  private canvasFillContainer() {
    this.gbConfig.silent = true;
    this.canvas.style.height = '100%';
    this.canvas.style.width = '100%';
    this.gbConfig.screenSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.canvas.style.height = this.gbConfig.height + 'px';
    this.canvas.height = this.gbConfig.height;
    this.canvas.style.width = this.gbConfig.width + 'px';
    this.canvas.width = this.gbConfig.width;
    this.gbConfig.silent = false;
  }

  canvasFitToBoundingBox(boundingBox: {x: number, y: number}) {
    this.gbConfig.silent = true;
    const maxZoom = 10;
    this.gbConfig.zoom =
      Math.floor(
        Math.min((this.gbConfig.width / boundingBox.x) - this.gbConfig.cellSpace,
          (this.gbConfig.height / boundingBox.y) - this.gbConfig.cellSpace,
          maxZoom)
      );
    this.gbConfig.xScreenOffset = 0;
    this.gbConfig.yScreenOffset = 0;
    this.gbConfig.silent = false;
  }

  drawWorld() {
    this.gbConfig.silent = true;

    // Fill background
    this.ctx.fillStyle = this.gbStyleConfig.borderColour;
    this.ctx.fillRect(0, 0, this.gbConfig.width, this.gbConfig.height);

    for (let x = 0; x < this.gbConfig.columns; x++) {
      for (let y = 0; y < this.gbConfig.rows; y++) {
        this.drawCell(x, y, this.gameOfLifeService.isAlive(x + this.gbConfig.xScreenOffset, y + this.gbConfig.yScreenOffset));
      }
    }
    this.gbConfig.silent = false;
  }

  drawCell(x: number, y: number, alive: boolean) {
    if (alive) {
      this.ctx.fillStyle = this.gbStyleConfig.aliveCellColour;
    } else {
      this.ctx.fillStyle = this.gbStyleConfig.deadCellColour;
    }

    this.ctx.clearRect(
      this.gbConfig.cellSpace + (this.gbConfig.cellSpace * x) + (this.gbConfig.cellSize * x),
      this.gbConfig.cellSpace + (this.gbConfig.cellSpace * y) + (this.gbConfig.cellSize * y),
      this.gbConfig.cellSize,
      this.gbConfig.cellSize
    );
    this.ctx.fillRect(
      this.gbConfig.cellSpace + (this.gbConfig.cellSpace * x) + (this.gbConfig.cellSize * x),
      this.gbConfig.cellSpace + (this.gbConfig.cellSpace * y) + (this.gbConfig.cellSize * y),
      this.gbConfig.cellSize,
      this.gbConfig.cellSize
    );
  }

  toggleCell(x: number, y: number) {
    this.gameOfLifeService.toggleCell(x, y);
  }

  onCanvasEntered() {
    if (!this.preview) {
      return;
    }
    this.gameOfLifeService.startGame();

    return false;
  }

  onCanvasClick() {
    return false;
  }

  onCanvasMouseUp(event: MouseEvent) {
    this.mouseDown = false;
    this.lastSelectedCell = null;

    return false;
  }

  onCanvasExited() {
    if (!this.preview) {
      this.mouseDown = false;
      return;
    }
    this.gameOfLifeService.clear();
    this.template.then((template: Template) => {
      this.gameOfLifeService.applyTemplate(template, this.gbConfig.columns, this.gbConfig.rows);
    });

    return false;
  }

  onCanvasMouseDown(event: MouseEvent) {
    if (this.preview) {
      return;
    }
    const cell: {x: number, y: number} = this.getSelectedCell(event);
    this.toggleCell(cell.x + this.gbConfig.xScreenOffset, cell.y + this.gbConfig.yScreenOffset);
    this.lastSelectedCell = cell;
    this.mouseDown = true;

    return false;
  }

  onCanvasMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      const cell: {x: number, y: number} = this.getSelectedCell(event);
      if (cell.x !== this.lastSelectedCell.x || cell.y !== this.lastSelectedCell.y) {
        this.toggleCell(cell.x + this.gbConfig.xScreenOffset, cell.y + this.gbConfig.yScreenOffset);
        this.lastSelectedCell = cell;
      }
    }

    return false;
  }

  private getSelectedCell(event: MouseEvent): {x: number, y: number} {
    let posX = 0;
    let posY = 0;

    if (event.pageX || event.pageY) {
      posX = event.pageX;
      posY = event.pageY;
    } else if (event.clientX || event.clientY) {
      posX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    let element: HTMLElement = <HTMLElement> event.target;
    let left = 0;
    let top = 0;
    while (element.offsetParent) {
      left += element.offsetLeft;
      top += element.offsetTop;
      element = <HTMLElement> element.offsetParent;
    }

    const x = Math.ceil(((posX - left) / (this.gbConfig.cellSize + this.gbConfig.cellSpace)) - 1);
    const y = Math.ceil(((posY - top) / (this.gbConfig.cellSize + this.gbConfig.cellSpace)) - 1);

    return {x: x, y: y};
  };

  ngOnDestroy(): void {
    if (this.cellStateSubscription != null) {
      this.cellStateSubscription.unsubscribe();
    }
    if (this.cellStateSubscription != null) {
      this.gameBoardConfigSubscription.unsubscribe();
    }
  }

}
