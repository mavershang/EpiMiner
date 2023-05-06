import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WgcnaGeneTableComponent } from './wgcna-gene-table.component';

describe('WgcnaGeneTableComponent', () => {
  let component: WgcnaGeneTableComponent;
  let fixture: ComponentFixture<WgcnaGeneTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WgcnaGeneTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WgcnaGeneTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
