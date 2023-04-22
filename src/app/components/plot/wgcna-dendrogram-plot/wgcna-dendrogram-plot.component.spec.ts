import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WgcnaDendrogramPlotComponent } from './wgcna-dendrogram-plot.component';

describe('WgcnaDendrogramPlotComponent', () => {
  let component: WgcnaDendrogramPlotComponent;
  let fixture: ComponentFixture<WgcnaDendrogramPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WgcnaDendrogramPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WgcnaDendrogramPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
