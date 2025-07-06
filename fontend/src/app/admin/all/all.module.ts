import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AllRoutingModule } from './all-routing.module';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { AllService } from './services/all.service';
import { AlllistComponent } from './alllist/alllist.component';
import { EditAllComponent } from './view-details-all/dialogs/edit-all/edit-all.component';
import { DeleteEmployeeComponent } from './alllist/dialog/delete-employee/delete-employee.component';
import { AddEmployeeComponent } from './alllist/dialog/add-employee/add-employee.component';
import { ViewDetailsAllComponent } from './view-details-all/view-details-all.component';

@NgModule({
  declarations: [
    AlllistComponent,
    EditAllComponent,
    DeleteEmployeeComponent,
    AddEmployeeComponent,
    ViewDetailsAllComponent,
   
  ],
  providers: [AllService],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    AllRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    NgScrollbarModule,
    MatCheckboxModule,
  ],
})
export class AllModule {}
