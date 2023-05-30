import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneSignatureAnalysisComponent } from './gene-signature-analysis.component';

describe('GeneSignatureAnalysisComponent', () => {
  let component: GeneSignatureAnalysisComponent;
  let fixture: ComponentFixture<GeneSignatureAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneSignatureAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneSignatureAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
