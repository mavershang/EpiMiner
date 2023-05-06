import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WgcnaSampleTreePlotComponent } from './wgcna-sample-tree-plot.component';

describe('WgcnaSampleTreePlotComponent', () => {
  let component: WgcnaSampleTreePlotComponent;
  let fixture: ComponentFixture<WgcnaSampleTreePlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WgcnaSampleTreePlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WgcnaSampleTreePlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
