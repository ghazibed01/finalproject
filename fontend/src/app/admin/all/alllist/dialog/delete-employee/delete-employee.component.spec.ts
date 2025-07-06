import { DeleteProjectmanagerComponent } from './../../../../projectmanager/projectmanagerlist/dialog/delete-projectmanager/delete-projectmanager.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('DeleteProjectmanagerComponent', () => {
  let component: DeleteProjectmanagerComponent;
  let fixture: ComponentFixture<DeleteProjectmanagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteProjectmanagerComponent]
    });
    fixture = TestBed.createComponent(DeleteProjectmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
