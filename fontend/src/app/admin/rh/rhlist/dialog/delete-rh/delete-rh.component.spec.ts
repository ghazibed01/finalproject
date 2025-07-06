import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRhComponent } from './delete-rh.component'; 

describe('DeleteProjectmanagerComponent', () => {
  let component: DeleteRhComponent;
  let fixture: ComponentFixture<DeleteRhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteRhComponent]
    });
    fixture = TestBed.createComponent(DeleteRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
