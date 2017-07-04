import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutLinksComponent } from './about-links.component';

describe('AboutLinksComponent', () => {
  let component: AboutLinksComponent;
  let fixture: ComponentFixture<AboutLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
