import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsRhComponent } from './view-details-rh.component';

describe('ViewDetailsRhComponent', () => {
  let component: ViewDetailsRhComponent;
  let fixture: ComponentFixture<ViewDetailsRhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDetailsRhComponent]
    });
    fixture = TestBed.createComponent(ViewDetailsRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
