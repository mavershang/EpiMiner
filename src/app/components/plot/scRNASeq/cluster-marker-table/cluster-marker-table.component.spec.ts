import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterMarkerTableComponent } from './cluster-marker-table.component';

describe('ClusterMarkerTableComponent', () => {
  let component: ClusterMarkerTableComponent;
  let fixture: ComponentFixture<ClusterMarkerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClusterMarkerTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClusterMarkerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
