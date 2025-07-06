import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { RhRoutingModule } from './rh-routing.module'; 
import { RhService } from './services/rh.service';
import { ViewDetailsRhComponent } from './view-details-rh/view-details-rh.component'; 
import { AddRhComponent } from './rhlist/dialog/add-rh/add-rh.component'; 
import { RhlistComponent } from './rhlist/rhlist.component'; 
import { EditRhComponent } from './view-details-rh/dialogs/edit-rh/edit-rh.component'; 
import { DeleteRhComponent } from './rhlist/dialog/delete-rh/delete-rh.component'; 

@NgModule({
  declarations: [
    RhlistComponent,
    EditRhComponent,
    DeleteRhComponent,
    AddRhComponent,
    ViewDetailsRhComponent,
  ],
  providers: [RhService],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    RhRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    NgScrollbarModule,
    MatCheckboxModule,
  ],
})
export class RhModule {}
