import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhlistComponent } from './rhlist.component';

describe('RhlistComponent', () => {
  let component:RhlistComponent;
  let fixture: ComponentFixture<RhlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhlistComponent]
    });
    fixture = TestBed.createComponent(RhlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
