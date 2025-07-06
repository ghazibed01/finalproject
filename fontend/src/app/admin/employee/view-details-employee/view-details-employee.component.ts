import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { User } from '../model/User';
import { MatDialog } from '@angular/material/dialog';
import { EditEmployeeComponent } from './dialogs/edit-employee/edit-employee.component';

@Component({
  selector: 'app-view-details-employee',
  templateUrl: './view-details-employee.component.html',
  styleUrls: ['./view-details-employee.component.scss']
})
export class ViewDetailsEmployeeComponent implements OnInit {
  public employee: User | undefined;
  public isLoading = true;
  isInputDisabled: boolean = true;
  convertedImg:any;
  username: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    
    this.getEmployeeDetails();
  }
  private convertImageData(base64Data: string): string {
    return `data:image/png;base64,${base64Data}`;
  }
  getEmployeeDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getUserById(Number(id)).subscribe(
        (employee: User) => {
          this.employee = employee;
          this.employee.id=id;
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
  
  updatePassword(): void {
    const formData = {
      username: this.username,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };
    this.employeeService.updatePassword(formData)
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
    const dialogRef = this.dialog.open(EditEmployeeComponent, {
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
}

