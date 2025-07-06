import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsAllComponent } from './view-details-all.component';

describe('ViewDetailsAllComponent', () => {
  let component: ViewDetailsAllComponent;
  let fixture: ComponentFixture<ViewDetailsAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDetailsAllComponent]
    });
    fixture = TestBed.createComponent(ViewDetailsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
