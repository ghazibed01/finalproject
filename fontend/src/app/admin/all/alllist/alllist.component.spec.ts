import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectmanagerlistComponent } from 'app/admin/projectmanager/projectmanagerlist/rhlist.component';

describe('ProjectmanagerlistComponent', () => {
  let component: ProjectmanagerlistComponent;
  let fixture: ComponentFixture<ProjectmanagerlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectmanagerlistComponent]
    });
    fixture = TestBed.createComponent(ProjectmanagerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
