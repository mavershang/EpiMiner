import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotWgcnaComponent } from './plot-wgcna.component';

describe('PlotWgcnaComponent', () => {
  let component: PlotWgcnaComponent;
  let fixture: ComponentFixture<PlotWgcnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlotWgcnaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlotWgcnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
