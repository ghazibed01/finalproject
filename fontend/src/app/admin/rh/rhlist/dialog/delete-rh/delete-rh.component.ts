import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'app/admin/rh/model/User'; 

@Component({
  selector: 'app-delete-rh',
  templateUrl: './delete-rh.component.html',
  styleUrls: ['./delete-rh.component.scss']
})
export class DeleteRhComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteRhComponent>,
    @Inject(MAT_DIALOG_DATA) public projectmanager: User // Injecter les données dans le composant
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}