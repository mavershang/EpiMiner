import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotDEComponent } from './plot-de.component';

describe('PlotDEComponent', () => {
  let component: PlotDEComponent;
  let fixture: ComponentFixture<PlotDEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlotDEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlotDEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
