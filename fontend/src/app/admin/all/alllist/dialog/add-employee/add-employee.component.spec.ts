import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectmanagerComponent } from 'app/admin/projectmanager/projectmanagerlist/dialog/add-projectmanager/add-projectmanager.component';

describe('AddProjectmanagerComponent', () => {
  let component: AddProjectmanagerComponent;
  let fixture: ComponentFixture<AddProjectmanagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProjectmanagerComponent]
    });
    fixture = TestBed.createComponent(AddProjectmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
