import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WgcnaPathwayTableComponent } from './wgcna-pathway-table.component';

describe('WgcnaPathwayTableComponent', () => {
  let component: WgcnaPathwayTableComponent;
  let fixture: ComponentFixture<WgcnaPathwayTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WgcnaPathwayTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WgcnaPathwayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
