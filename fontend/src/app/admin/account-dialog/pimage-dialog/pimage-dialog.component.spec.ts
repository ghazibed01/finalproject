import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PImageDialogComponent } from './pimage-dialog.component';

describe('PImageDialogComponent', () => {
  let component: PImageDialogComponent;
  let fixture: ComponentFixture<PImageDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PImageDialogComponent]
    });
    fixture = TestBed.createComponent(PImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
