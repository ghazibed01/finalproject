import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EmployeeRoutingModule } from './employee-routing.module';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { EmployeeService } from './services/employee.service';
import { EmployeelistComponent } from './employeelist/employeelist.component';
import { EditEmployeeComponent } from './view-details-employee/dialogs/edit-employee/edit-employee.component';
import { DeleteEmployeeComponent } from './employeelist/dialog/delete-employee/delete-employee.component';
import { AddEmployeeComponent } from './employeelist/dialog/add-employee/add-employee.component';
import { ViewDetailsEmployeeComponent } from './view-details-employee/view-details-employee.component';

@NgModule({
  declarations: [
    EmployeelistComponent,
    EditEmployeeComponent,
    DeleteEmployeeComponent,
    AddEmployeeComponent,
    ViewDetailsEmployeeComponent,
   
  ],
  providers: [EmployeeService],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    NgScrollbarModule,
    MatCheckboxModule,
  ],
})
export class EmployeeModule {}
