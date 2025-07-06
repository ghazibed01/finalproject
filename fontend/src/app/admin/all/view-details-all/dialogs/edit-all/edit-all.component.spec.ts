import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectmanagerComponent } from 'app/admin/projectmanager/view-details-projectmanager/dialogs/edit-projectmanager/edit-projectmanager.component';

describe('EditProjectmanagerComponent', () => {
  let component: EditProjectmanagerComponent;
  let fixture: ComponentFixture<EditProjectmanagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditProjectmanagerComponent]
    });
    fixture = TestBed.createComponent(EditProjectmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
