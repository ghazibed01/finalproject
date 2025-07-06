import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EmployeeService } from 'app/admin/employee/services/employee.service';
import { number } from 'echarts';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  public pmForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
departments: string[] = ['Linux Platforms(Red Hat)', 'Virtualization Platform', 'JBoss Middleware', 'Management','Mobile Platform']; 
isOtherDepartment: boolean = false;
  constructor(private fb: FormBuilder, private emService: EmployeeService ,public dialogRef:MatDialogRef<AddEmployeeComponent> , private snackBar: MatSnackBar) {
    this.pmForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      joiningDate: ['', Validators.required],
      department: ['', Validators.required],
       otherDepartment: [''],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      information: ['', Validators.required],
      profileImage: [null]
    } ,{ });

         // Rendre otherDepartment obligatoire si "Autre" est sélectionné
  this.pmForm.get('department')?.valueChanges.subscribe(value => {
    if (value === 'other') {
      this.isOtherDepartment = true;
      this.pmForm.get('otherDepartment')?.setValidators([Validators.required]);
    } else {
      this.isOtherDepartment = false;
      this.pmForm.get('otherDepartment')?.clearValidators();
      this.pmForm.get('otherDepartment')?.setValue('');
    }
    this.pmForm.get('otherDepartment')?.updateValueAndValidity();
  });
  }

  ngOnInit(): void {
    const generatedPassword = this.generateRandomPassword();
    this.pmForm.patchValue({
    password: generatedPassword,

  });
  }

  onDepartmentChange(value: any) {
  if (value === 'other') {
    if (!this.pmForm.contains('otherDepartment')) {
      this.pmForm.addControl('otherDepartment', new FormControl('', Validators.required));
    }
  } else {
    if (this.pmForm.contains('otherDepartment')) {
      this.pmForm.removeControl('otherDepartment');
    }
  }
}

  get uploadFileControl(): FormControl {
    return this.pmForm.get('profileImage') as FormControl;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
generateRandomPassword(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
  onSubmit() {
     let formValue = this.pmForm.value;
  if (formValue.department === 'other') {
    formValue.department = formValue.otherDepartment;
  }
    const formData = new FormData();
    formData.append('employee', JSON.stringify(this.pmForm.value));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
   // Log the FormData contents for debugging
   formData.forEach((value, key) => {
    if (value instanceof File) {
      console.log(`${key}: ${value.name}, ${value.size} bytes, ${value.type}`);
    } else {
      console.log(`${key}: ${value}`);
    }
  });

 
    this.emService.addEmployee(formData).subscribe(
      (res) => {
        this.showSuccess();
        this.resetForm();
                  // Optionally, display a success message or redirect the user
          this.dialogRef.close();
          this.showNotification(
          'snackbar-success',
          'Employee added successfully...!!!',
          'bottom',
          'center'
        );
      },
      (error) => {
        console.error("Error adding user", error);
        this.snackBar.open("Something went wrong", "Close", { duration: 5000 });
      }
    );
  }
  showSuccess() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'User added successfully',
      showConfirmButton: false,
      timer: 3000,
    });
  }
  resetForm(): void {
    this.pmForm.reset();
    this.imagePreview = null;
    this.selectedFile = null;
  }
  
  
  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
