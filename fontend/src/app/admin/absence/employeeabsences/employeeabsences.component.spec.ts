import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAbsencesComponent } from './employeeabsences.component';

describe('EmployeeAbsencesComponent', () => {
  let component: EmployeeAbsencesComponent;
  let fixture: ComponentFixture<EmployeeAbsencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeAbsencesComponent]
    });
    fixture = TestBed.createComponent(EmployeeAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
