
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { AbsenceService } from 'app/admin/absence/service/absence.service'; 
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form-dialog:not(n)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent  {
  absenceForm: FormGroup;
  isSubmitting = false;
  technologyCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  dialogTitle: string;
  absence:any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    private fb: FormBuilder ,
     private absenceService: AbsenceService,
  ) {
    this.absenceForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required]
    });
    // Set the defaults
      this.dialogTitle = 'Absence';
    }
   
  
submitForm(): void {
  if (this.absenceForm.valid) {
    const formValue = this.absenceForm.value;

    const startDate = new Date(formValue.startDate);
    const endDate = new Date(formValue.endDate);
    const today = new Date();

    if (startDate > endDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Dates',
        text: 'Start date must be before end date.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    if (startDate.getTime() < today.setHours(0, 0, 0, 0)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Start Date',
        text: 'Start date cannot be in the past.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    this.isSubmitting = true;

    this.absenceService.createAbsence(formValue).subscribe({
      next: () => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: 'Absence Submitted',
          text: 'Your absence has been successfully submitted!',
          confirmButtonColor: '#3085d6',
        }).then(() => {
            this.absenceForm.reset();
           this.dialogRef.close('submit'); 
        });

      
     
      },
      error: (error) => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Submission Error',
          text: 'There was an error submitting the absence.',
          confirmButtonColor: '#d33',
        });
        console.error('Error:', error);
      }
    });
  }
}




  onNoClick(): void {
    this.dialogRef.close();
  }
 
}
