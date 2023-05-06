import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScRNASeqHolderComponent } from './sc-rnaseq-holder.component';

describe('ScRNASeqHolderComponent', () => {
  let component: ScRNASeqHolderComponent;
  let fixture: ComponentFixture<ScRNASeqHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScRNASeqHolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScRNASeqHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
