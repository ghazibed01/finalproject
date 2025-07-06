import { ViewDetailsEmployeeComponent } from './view-details-employee/view-details-employee.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "../../authentication/page404/page404.component";
import { EmployeelistComponent } from "./employeelist/employeelist.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'employeelist', 
        component: EmployeelistComponent,
      },
      {
        path: 'view/details/employee/:id',
        component: ViewDetailsEmployeeComponent,
      },
      
      { path: "**", component: Page404Component },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}

