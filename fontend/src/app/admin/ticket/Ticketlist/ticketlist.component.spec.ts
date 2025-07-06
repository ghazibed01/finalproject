import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketlistComponent } from './ticketlist.component'; 

describe('EmployeelistComponent', () => {
  let component: TicketlistComponent;
  let fixture: ComponentFixture<TicketlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicketlistComponent]
    });
    fixture = TestBed.createComponent(TicketlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
