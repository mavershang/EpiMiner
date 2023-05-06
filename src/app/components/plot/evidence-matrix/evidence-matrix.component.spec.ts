import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenceMatrixComponent } from './evidence-matrix.component';

describe('EvidenceMatrixComponent', () => {
  let component: EvidenceMatrixComponent;
  let fixture: ComponentFixture<EvidenceMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenceMatrixComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenceMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
