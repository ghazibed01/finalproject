import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountDialogComponent } from './account-dialog/account-dialog.component'; // Imp
import { MatIconModule } from '@angular/material/icon';
import { UpdateDialogComponent } from './account-dialog/update-dialog/update-dialog.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PImageDialogComponent } from './account-dialog/pimage-dialog/pimage-dialog.component';
@NgModule({
  declarations: [
  
  
    SettingsDialogComponent,
          AccountDialogComponent,
          UpdateDialogComponent,
          PImageDialogComponent
  ],

  imports: [CommonModule,
     AdminRoutingModule ,
     MatIconModule,
     ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule ],
})
export class AdminModule {
  
}
