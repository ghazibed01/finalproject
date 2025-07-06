import { Component, OnInit ,Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllService } from '../services/all.service';
import { User } from '../model/User';
import { MatDialog } from '@angular/material/dialog';
import { EditAllComponent } from './dialogs/edit-all/edit-all.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from '../model/Role';
import Swal from 'sweetalert2';
import { ERole } from '../model/ERole';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-view-details-all',
  templateUrl: './view-details-all.component.html',
  styleUrls: ['./view-details-all.component.scss']
})
export class ViewDetailsAllComponent implements OnInit {
  public employee: User | undefined;
  public isLoading = true;
  isInputDisabled: boolean = true;
  convertedImg:any;
  username: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  role: string = '';
  roles: Role[] = [];
  
  Eroles: string[] = [];
  constructor(
    private route: ActivatedRoute,
    private allService: AllService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewDetailsAllComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) { }
  roleControl  = new FormControl();
  ngOnInit(): void {
    this.getEmployeeDetails();
    this.Eroles = Object.values(ERole);
  }
  private convertImageData(base64Data: string): string {
    return `data:image/png;base64,${base64Data}`;
  }
  getEmployeeDetails(): void {
    const id = this.user.id;
    if (id) {
      this.allService.getUserById(Number(id)).subscribe(
        (employee: User) => {
          this.employee = employee;
          this.employee.id=id;
          this.allService.getUserRoles(this.user?.id).subscribe(
            (roles: Role[]) => {
              this.roles = roles;
              console.log('User roles:', this.roles);
            },
            (error) => {
              console.error('Error fetching user roles:', error);
            });
          this.convertedImg = this.convertImageData(employee.imageData);
          console.log("idgetDetails",this.employee.id)
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching PM details:', error);
          this.isLoading = false;
        }
      );
    }
  }
  showCustomPosition() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'New Role !!',
      showConfirmButton: false,
      timer: 1500,
    });
  }
  updateUserRoles(userId: number, roleNames: string) {
    this.allService.updateUserRoles(userId, roleNames)
   
      .subscribe(
        (updatedUser: any) => { 
          console.log("Rolename",roleNames);
          console.log('User roles updated:', updatedUser);
          this.showCustomPosition();
        },
        (error) => {
          console.error('Error updating user roles:', error);
        }
      );
  }
  updatePassword(): void {
    const formData = {
      username: this.username,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };
    this.allService.updatePassword(formData)
    .subscribe(
      response => {
        console.log('Password updated successfully', response);
      },
      error => {
        console.log(formData);
        console.error('Error updating password', error);
      }
    );
  }
  openUpdateModal(): void {
    const dialogRef = this.dialog.open(EditAllComponent, {
      width: '600px',
      height: '650px',
      data: { pm: this.employee } ,
     
      
    });
console.log(this.employee)
console.log("test",this.employee?.id)
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after modal is closed, such as refreshing details
      this.getEmployeeDetails();
      this.isLoading = true;
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}

