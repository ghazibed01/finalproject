import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbsenceService } from 'app/admin/absence/service/absence.service';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss'],
})
export class AddFileComponent {
 File: File | null = null;  // UML file
 FileName: string = '';     // UML file name
 

  constructor(
    private dialogRef: MatDialogRef<AddFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private absenceService: AbsenceService,
    private snackBar: MatSnackBar
  ) {}

  // Handle UML file selection
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.File = target.files[0];  // Only select the first file
      this.FileName = this.File.name;
    }
  }



  // Upload UML file
  uploadFile() {
    if (this.File && this.data.absenceId) {
      this.absenceService.addJustifToAbsence(this.data.absenceId, this.File).subscribe({
        next: (response) => {
          this.snackBar.open('UML file uploaded successfully!', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Upload UML error:', error);
          this.snackBar.open('Failed to upload UML file: ' + error.error, 'Close', {
            duration: 5000
          });
        }
      });
    }
  }



  // Close dialog
  close() {
    this.dialogRef.close();
  }
}