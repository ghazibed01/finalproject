
import { User } from 'app/admin/rh/model/User';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RhService } from 'app/admin/rh/services/rh.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss']
})
export class UpdateDialogComponent {
  pmForm: FormGroup;
  idPM!: any;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private dialogRef: MatDialogRef<UpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pm: User }, // Inject data
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private rhservice: RhService,
  
  ) {
    // Initialize form with data passed from parent component
    this.pmForm = this.fb.group({
      username: [data.pm.username, Validators.required],
      email: [data.pm.email, [Validators.required, Validators.email]],
      mobile: [data.pm.mobile, Validators.required],
      gender:[data.pm.gender, Validators.required],
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
        const gender=this.pmForm.get('gender');
        const department = this.pmForm.get('department');
        const information = this.pmForm.get('information');
        const address = this.pmForm.get('address');
    //check if these variables are truthy before accessing their value property to avoid accessing properties of null
        if (username && email && department &&
          mobile && information ) {
          const updatedPM: any = {
            username: username.value,
            email: email.value,
            gender:gender?.value,
            department: department.value,
            mobile: mobile.value,
            information: information.value,
            address:address?.value,
          };
          
   
          this.rhservice.updatePM(this.idPM,updatedPM)
         
            .subscribe(
             
              () => {
                this.showNotification(
                  'snackbar-success',
                  ' Update Account Successfully...!!!',
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