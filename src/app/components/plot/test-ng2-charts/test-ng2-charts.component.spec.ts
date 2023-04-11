import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestNg2ChartsComponent } from './test-ng2-charts.component';

describe('TestNg2ChartsComponent', () => {
  let component: TestNg2ChartsComponent;
  let fixture: ComponentFixture<TestNg2ChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestNg2ChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestNg2ChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
