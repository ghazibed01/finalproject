import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AllAbsenceComponent } from "./allabsence.component";
describe("AllAbsenceComponent", () => {
  let component: AllAbsenceComponent;
  let fixture: ComponentFixture<AllAbsenceComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AllAbsenceComponent],
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(AllAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
