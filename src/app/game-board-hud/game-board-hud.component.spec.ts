import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoardHudComponent } from './game-board-hud.component';

describe('GameBoardHudComponent', () => {
  let component: GameBoardHudComponent;
  let fixture: ComponentFixture<GameBoardHudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameBoardHudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameBoardHudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
