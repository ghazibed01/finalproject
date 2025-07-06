import { RhService } from 'app/admin/rh/services/rh.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '@core/service/storage.service';
import { User } from '../rh/model/User';
import { MatDialogRef } from '@angular/material/dialog';
import { UpdateDialogComponent } from './update-dialog/update-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PImageDialogComponent } from './pimage-dialog/pimage-dialog.component';
@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss']
})
export class AccountDialogComponent implements OnInit {
  public user: User | undefined;
  public isLoading = true;
  isInputDisabled: boolean = true;
  convertedImg:any;
  storedUser  =this.storageService.getUser();
 constructor(private storageService:StorageService,
   private rhService :RhService,
   private dialogRef: MatDialogRef<AccountDialogComponent>,
   private dialog: MatDialog){} 
 ngOnInit(): void {
    
  this.ShowAccount();
}
 private convertImageData(base64Data: string): string {
  return `data:image/png;base64,${base64Data}`;
}
refresh() {
  this.ShowAccount();
}
ShowAccount(){
 
    this.rhService.getUserById(this.storedUser.id).subscribe(
      (user: User) => {
        this.user = user;
        console.log("user",user);
        console.log("storeduser",this.storedUser)
        this.convertedImg = this.convertImageData(user.imageData);
        console.log("idgetDetails",this.user.id)
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching PM details:', error);
        this.isLoading = false;
      }
    );
 
}
closeDialog(): void {
  this.dialogRef.close();
}
openUpdateModal(): void {
  const dialogRef = this.dialog.open(UpdateDialogComponent, {
    width: '600px',
    height: '650px',
    data: { pm: this.user } ,
   
    
  });
console.log(this.user)
console.log("test",this.user?.id)
  dialogRef.afterClosed().subscribe(
    result => {
    console.log('The dialog was closed');

    this.ShowAccount();
    this.isLoading = true;
  });
}
openUpdateImage(): void {
  const dialogRef = this.dialog.open(PImageDialogComponent, {
    width: '500px', // Adjust the width as needed
    data: {} // Pass any data if needed
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // Handle any actions after the dialog is closed
  });
}
}
