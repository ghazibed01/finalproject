import { Component, OnInit } from '@angular/core';
import { StorageService } from '@core/service/storage.service';
import { RhService } from 'app/admin/rh/services/rh.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
@Component({
  selector: 'app-pimage-dialog',
  templateUrl: './pimage-dialog.component.html',
  styleUrls: ['./pimage-dialog.component.scss']
})
export class PImageDialogComponent implements OnInit{
storedUser  =this.storageService.getUser();
selectedFile:any;
imagePreview: string | ArrayBuffer | null = null;
  constructor(private storageService:StorageService,private userService: RhService,public dialogRef:MatDialogRef<PImageDialogComponent> , private snackBar: MatSnackBar) { }

  ngOnInit(): void {
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

  onSubmit() {
    const formData = new FormData();
    if (this.selectedFile) {
        formData.append('file', this.selectedFile); // Add the selected file to FormData
    }

    // Log the FormData contents for debugging
    formData.forEach((value, key) => {
        if (value instanceof File) {
            console.log(`${key}: ${value.name}, ${value.size} bytes, ${value.type}`);
        } else {
            console.log(`${key}: ${value}`);
        }
    });

    const userId = this.storedUser.id; // Replace with the actual user ID
    this.userService.uploadProfileImage(userId, formData).subscribe(
        (res) => {
            this.showSuccess();

            // Optionally, display a success message or redirect the user
            this.dialogRef.close();
            this.showNotification(
                'snackbar-success',
                'Profile image uploaded successfully...!!!',
                'bottom',
                'center'
            );
        },
        (error) => {
            console.error("Error uploading image", error);
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
}
