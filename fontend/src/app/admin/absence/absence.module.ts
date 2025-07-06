import { NgModule ,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbsenceRoutingModule } from './absence-routing.module';
import { AllAbsenceComponent } from './allabsence/allabsence.component'; 
import { FormDialogComponent } from './allabsence/dialog/form-dialog/form-dialog.component'; 
import { AbsenceService } from './service/absence.service';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AddFileComponent } from './allabsence/dialog/add-file/add-file.component'; 
import { EmployeeAbsencesComponent } from './employeeabsences/employeeabsences.component'; 
@NgModule({
  declarations: [
    AllAbsenceComponent,
    FormDialogComponent,
    AddFileComponent,
    EmployeeAbsencesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AbsenceRoutingModule,
    ComponentsModule,
    SharedModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],
  providers: [AbsenceService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AbsenceModule {}
