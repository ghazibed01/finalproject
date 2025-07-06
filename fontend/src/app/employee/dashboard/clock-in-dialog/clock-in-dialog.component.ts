import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarService } from 'app/calendar/calendar.service'; 
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { Calendar } from 'app/calendar/calendar.model'; 
import { ClockInService } from './clock-in.service';
import { User } from '@core/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  id: number;
  action: string;
  calendar: Calendar;
}

@Component({
  selector: 'app-form-dialog:not(o)',
  templateUrl: './clock-in-dialog.component.html',
  styleUrls: ['./clock-in-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClockInDialogComponent implements OnInit {
  punchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClockInDialogComponent>,
    private ClockInService: ClockInService,
    private snackBar: MatSnackBar, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.punchForm = this.fb.group({
      time: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const now = new Date();
    const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    this.punchForm.patchValue({ time: localISOTime });
  }

onSubmit(): void {
  if (this.punchForm.valid) {
    this.ClockInService.createClockIn(this.punchForm.value).subscribe({
      next: () => {
        this.dialogRef.close('submit');
      },
      error: (err) => {
        console.error('Error saving punch-in:', err);

        if (err.status === 400 && err.error === 'User has already checked in today.') {
          this.snackBar.open('You have already checked in today.', 'Close', { duration: 3000 });
          this.dialogRef.close();
        } else {
          this.snackBar.open('Failed to save check-in. Please try again.', 'Close', { duration: 3000 });
        }
      }
    });
  }}

  onCancel(): void {
    this.dialogRef.close();
  }
}
