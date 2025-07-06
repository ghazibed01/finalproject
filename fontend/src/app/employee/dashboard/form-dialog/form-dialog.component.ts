import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CalendarService } from 'app/calendar/calendar.service'; 
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { Calendar } from 'app/calendar/calendar.model'; 
import { EmployeeService } from 'app/admin/employee/services/employee.service';
import { User } from '@core/models/user';
import Swal from 'sweetalert2';

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
export class FormsDialogComponent {
  action: string;
  dialogTitle: string;
  calendarForm: UntypedFormGroup;
  titleSelectControl!: UntypedFormControl;

  calendar: Calendar;
  showDeleteBtn = false;
   userInfo: User | null = null; 
  constructor(
    public dialogRef: MatDialogRef<FormsDialogComponent>,
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
      this.titleSelectControl = new UntypedFormControl(this.calendar.title || '', Validators.required);

      this.showDeleteBtn = true;
       // ✅ Fetch the user info for display
      this.fetchUserInfo(data.calendar.userId);
    } else {
      this.dialogTitle = 'New Leave';
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

isOtherSelected = false;
customLeaveType: string = '';

 
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
      { value: this.calendar.title || '', disabled: this.action === 'edit' },
      Validators.required,
    ],
    customTitle: [''],  
    startDate: [
      { value: this.calendar.startDate, disabled: this.action === 'edit' },
      Validators.required,
    ],
    endDate: [
      { value: this.calendar.endDate, disabled: this.action === 'edit' },
      Validators.required,
    ],
  });
}

onTitleChange(value: string): void {
  this.isOtherSelected = value === 'other';

  if (!this.isOtherSelected) {
    this.customLeaveType = '';
    this.calendarForm.get('title')?.setValue(value);
  } else {
    this.calendarForm.get('title')?.setValue('');
  }
}

onCustomLeaveTypeChange(): void {
  this.calendarForm.get('title')?.setValue(this.customLeaveType);
}
public confirmAdd(): void {
  const formValue = this.calendarForm.getRawValue();

  // Récupération et conversion des dates
  const startDate = new Date(formValue.startDate);
  const endDate = new Date(formValue.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Supprime l'heure pour comparer uniquement la date

  // ✅ Validation : startDate >= today
  if (startDate < today) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Start Date',
      text: 'Start date must be today or a future date.',
      confirmButtonColor: '#d33',
    });
    return;
  }

  // ✅ Validation : startDate <= endDate
  if (startDate > endDate) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Date Range',
      text: 'End date must be after start date.',
      confirmButtonColor: '#d33',
    });
    return;
  }

  // 🟢 Si "Other" est sélectionné, utilise la saisie personnalisée
  if (this.isOtherSelected && formValue.customTitle) {
    formValue.title = formValue.customTitle;
  }

  const submit$ = this.action === 'edit'
    ? this.calendarService.updateCalendar(this.data.calendar.id, formValue)
    : this.calendarService.createCalendar(formValue);

  submit$.subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: this.action === 'edit' ? 'Event Updated' : 'Event Added',
        text: this.action === 'edit' ? 'Your leave has been successfully updated!' : 'Your leave has been successfully added!',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      this.dialogRef.close('submit');
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error ' + (this.action === 'edit' ? 'updating' : 'adding') + ' the event.',
        confirmButtonColor: '#d33',
      });
      console.error('Error:', error);
    }
  });
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
