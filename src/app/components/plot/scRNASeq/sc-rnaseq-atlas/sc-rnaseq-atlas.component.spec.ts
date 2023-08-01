import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScRNASeqAtlasComponent } from './sc-rnaseq-atlas.component';

describe('ScRNASeqAtlasComponent', () => {
  let component: ScRNASeqAtlasComponent;
  let fixture: ComponentFixture<ScRNASeqAtlasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScRNASeqAtlasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScRNASeqAtlasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
