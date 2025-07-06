import { Page404Component } from "./../authentication/page404/page404.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectRecordsComponent } from "./project-records/project-records.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  
 
  {
    path: "records",
    component: ProjectRecordsComponent,
  },
 
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
