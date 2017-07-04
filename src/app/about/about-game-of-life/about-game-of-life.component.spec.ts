import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutGameOfLifeComponent } from './about-game-of-life.component';

describe('AboutGameOfLifeComponent', () => {
  let component: AboutGameOfLifeComponent;
  let fixture: ComponentFixture<AboutGameOfLifeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutGameOfLifeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutGameOfLifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
