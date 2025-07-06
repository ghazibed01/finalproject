import { User } from 'app/admin/employee/model/User';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'app/admin/employee/services/employee.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-edit-all',
  templateUrl: './edit-all.component.html',
  styleUrls: ['./edit-all.component.scss']
})
export class EditAllComponent implements OnInit {
  pmForm: FormGroup;
  employee!: User;
  idPM!: any;



  constructor(
    private dialogRef: MatDialogRef<EditAllComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pm: User }, // Inject data
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private employeeservice: EmployeeService,
  
  ) {
    // Initialize form with data passed from parent component
    this.pmForm = this.fb.group({
      username: [data.pm.username, Validators.required],
      email: [data.pm.email, [Validators.required, Validators.email]],
      mobile: [data.pm.mobile, Validators.required],
      department: [data.pm.department, Validators.required],
      address: [data.pm.address, Validators.required],
      information: [data.pm.information, Validators.required],
    });
  const id= this.data.pm.id;

  console.log("id"+id);
  this.idPM= id ;
  console.log("idPM",this.idPM);
  }

  ngOnInit(): void {
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
    onSubmit() {
     if (this.pmForm.valid) {
        const username = this.pmForm.get('username');
        const email = this.pmForm.get('email');
        const mobile = this.pmForm.get('mobile');
        const department = this.pmForm.get('department');
        const information = this.pmForm.get('information');
        const address = this.pmForm.get('address');
    //check if these variables are truthy before accessing their value property to avoid accessing properties of null
        if (username && email && department &&
          mobile && information ) {
          const updatedPM: any = {
            username: username.value,
            email: email.value,
            department: department.value,
            mobile: mobile.value,
            information: information.value,
            address:address?.value,
            //sideEffects: sideEffectsControl.value,
         
          };
          this.employeeservice.updatePM(this.idPM,updatedPM)
            .subscribe(
              
              () => {
                this.showNotification(
                  'snackbar-success',
                  ' Update PM Successfully...!!!',
                  'bottom',
                  'center'
                );
                console.log("idUpdate"+this.idPM);
                this.dialogRef.close();
              },
              (error) => {
                console.error('Error updating :', error);
                this.showNotification('error', 'Failed to update PM', 'bottom', 'right');
              }
            );
        }
      } else {
        this.showNotification('snackbar-warning', 'Please fill all required fields', 'bottom', 'right');
      }
    }
  }