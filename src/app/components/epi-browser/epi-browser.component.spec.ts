import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiBrowserComponent } from './epi-browser.component';

describe('EpiBrowserComponent', () => {
  let component: EpiBrowserComponent;
  let fixture: ComponentFixture<EpiBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpiBrowserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
