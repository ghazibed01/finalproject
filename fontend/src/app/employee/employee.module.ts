
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { EmployeeRoutingModule } from './employee-routing.module';
import { ProjectRecordsComponent } from './project-records/project-records.component';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs'; // Add for mat-tab-group and mat-tab
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import { FormsDialogComponent } from './dashboard/form-dialog/form-dialog.component'; 

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClockInDialogComponent } from './dashboard/clock-in-dialog/clock-in-dialog.component';
import { PdfViewerDialogComponent } from './project-records/pdf-viewer-dialog/pdf-viewer-dialog.component';


@NgModule({
  declarations: [
    ProjectRecordsComponent,
    DashboardComponent,
    FormsDialogComponent,
    ClockInDialogComponent,
    PdfViewerDialogComponent,
   

 
  ],
  imports: [
    CommonModule,
    MatTabsModule,  // Add this to resolve mat-tab-group and mat-tab
    MatIconModule,  // Add this if you're using icons
    MatCheckboxModule,
    NgChartsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    EmployeeRoutingModule,
    NgApexchartsModule,
    NgScrollbarModule,
    DragDropModule,
    MatIconModule,
    ComponentsModule,
    SharedModule,
    MatInputModule,   
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,  
     
       

  ],
})
export class EmployeeModule {}
