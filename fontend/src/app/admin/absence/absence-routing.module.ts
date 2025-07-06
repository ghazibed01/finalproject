import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AllAbsenceComponent } from "./allabsence/allabsence.component";  
import { Page404Component } from "../../authentication/page404/page404.component";
import { EmployeeAbsencesComponent } from "./employeeabsences/employeeabsences.component"; 
const routes: Routes = [
  {
    path: "all-absence",
    component: AllAbsenceComponent,
  },

  {
    path: "my-absence",
    component: EmployeeAbsencesComponent,
  },

  { path: "**", component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbsenceRoutingModule {}
