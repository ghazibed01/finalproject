import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ClockInDialogComponent } from "./clock-in-dialog.component";

describe("FormDialogComponent", () => {
  let component: ClockInDialogComponent;
  let fixture: ComponentFixture<ClockInDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ClockInDialogComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
