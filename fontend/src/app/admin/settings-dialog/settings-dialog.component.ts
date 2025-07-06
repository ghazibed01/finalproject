
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RhService } from '../rh/services/rh.service';
import { StorageService } from '@core/service/storage.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  name: string = '';
  currentPassword: string = '';
  newPassword: string = '';
   storedUser  =this.storageService.getUser();
  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rhService: RhService,
    private storageService :StorageService,
  ) {}

  updatePassword(): void {
    this.name=this.storedUser.username;
    const formData = {
      username: this.name,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };
    this.rhService.updatePassword(formData).subscribe(
      response => {
        this.showSuccess();
        console.log('Password updated successfully', response);
        this.dialogRef.close();
      },
      error => {
        console.log(formData);
        console.error('Error updating password', error);
      }
    );
  }
  showSuccess() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Password updated successfully',
      showConfirmButton: false,
      timer: 3000,
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
