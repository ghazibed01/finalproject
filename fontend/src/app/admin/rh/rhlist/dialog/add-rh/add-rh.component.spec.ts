import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRhComponent } from './add-rh.component';

describe('AddProjectmanagerComponent', () => {
  let component: AddRhComponent;
  let fixture: ComponentFixture<AddRhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRhComponent]
    });
    fixture = TestBed.createComponent(AddRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
