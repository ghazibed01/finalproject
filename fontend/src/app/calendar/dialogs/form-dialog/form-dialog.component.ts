import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CalendarService } from '../../calendar.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { Calendar } from '../../calendar.model';
import { EmployeeService } from 'app/admin/employee/services/employee.service';
import { User } from '@core/models/user';

export interface DialogData {
  id: number;
  action: string;
  calendar: Calendar;
}

@Component({
  selector: 'app-form-dialog:not(o)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  calendarForm: UntypedFormGroup;
  calendar: Calendar;
  showDeleteBtn = false;
   userInfo: User | null = null; 
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public calendarService: CalendarService,
     private employeeService: EmployeeService,
    private fb: UntypedFormBuilder
  ) {
    console.log("data",data.calendar)
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.calendar.title;
      this.calendar = data.calendar;
      this.showDeleteBtn = true;
       // ✅ Fetch the user info for display
      this.fetchUserInfo(data.calendar.userId);
    } else {
      this.dialogTitle = 'New Event';
      const blankObject = {} as Calendar;
      this.calendar = new Calendar(blankObject);
      this.showDeleteBtn = false;
    }

    this.calendarForm = this.createContactForm();
  }
   // ✅ Fetch user info by userId
  fetchUserInfo(userId: number) {
    this.employeeService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.userInfo = user;
        console.log('User info:', user);
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      },
    });
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  // createContactForm(): UntypedFormGroup {
  //   return this.fb.group({
  //     title: [this.calendar.title, [Validators.required]],
  //     category: [this.calendar.category],
  //     startDate: [this.calendar.startDate, [Validators.required]],
  //     endDate: [this.calendar.endDate, [Validators.required]],
  //     details: [this.calendar.details],
  //   });
  // }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      title: [
        { value: this.calendar.title, disabled: this.action === 'edit' }, // disabled in edit mode
        [Validators.required],
      ],
      category: [this.calendar.category, [Validators.required]],
      startDate: [
        { value: this.calendar.startDate, disabled: this.action === 'edit' }, // disabled in edit mode
        [Validators.required],
      ],
      endDate: [
        { value: this.calendar.endDate, disabled: this.action === 'edit' }, // disabled in edit mode
        [Validators.required],
      ],
      details: [this.calendar.details, [Validators.required]],
    });
  }
  public confirmAdd(): void {
    if (this.action === 'edit' ) {
    
      // Update existing event
      this.calendarService.updateCalendar(this.data.calendar.id, this.calendarForm.getRawValue()).subscribe(
        (response) => {
          alert('Event updated successfully!');
          console.log('Updated event:', this.calendarForm.getRawValue());
          this.dialogRef.close('submit');
        },
        (error) => {
          alert('There was an error updating the event.');
          console.error('Error:', error);
        }
      );
    } else {
      // Create new event
      this.calendarService.createCalendar(this.calendarForm.getRawValue()).subscribe(
        (response) => {
          alert('Event added successfully!');
          console.log('Created event:', this.calendarForm.getRawValue());
          this.dialogRef.close('submit');
        },
        (error) => {
          alert('There was an error submitting the event.');
          console.error('Error:', error);
        }
      );
    }
  }

  deleteEvent(): void {
    if (this.data.calendar.id) {
      console.log("delete id ",this.data.calendar.id)
      this.calendarService.deleteCalendar(this.data.calendar.id).subscribe(
        () => {
          alert('Event deleted successfully!');
          this.dialogRef.close('delete');
        },
        (error) => {
          alert('There was an error deleting the event.');
          console.error('Error:', error);
        }
      );
    } else {
      console.error('Calendar ID is undefined or null');
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  submit() {
    // emppty stuff
  }
 
}
