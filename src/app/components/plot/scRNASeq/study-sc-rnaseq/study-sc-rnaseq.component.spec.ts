import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyScRNASeqComponent } from './study-sc-rnaseq.component';

describe('StudyScRNASeqComponent', () => {
  let component: StudyScRNASeqComponent;
  let fixture: ComponentFixture<StudyScRNASeqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyScRNASeqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyScRNASeqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
