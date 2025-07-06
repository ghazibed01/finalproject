import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { Page404Component } from './page404/page404.component';
import { SigninComponent } from './signin/signin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { CodeInputModule } from 'angular-code-input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importez BrowserAnimationsModule
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    Page404Component,
    SigninComponent,
    ActivateAccountComponent,
   
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    SharedModule,
    CodeInputModule,
    MatSnackBarModule, 

    
  ],
})
export class AuthenticationModule {}
