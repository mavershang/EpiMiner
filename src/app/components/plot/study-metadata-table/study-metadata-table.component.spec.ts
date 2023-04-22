import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyMetadataTableComponent } from './study-metadata-table.component';

describe('StudyMetadataTableComponent', () => {
  let component: StudyMetadataTableComponent;
  let fixture: ComponentFixture<StudyMetadataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyMetadataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyMetadataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
