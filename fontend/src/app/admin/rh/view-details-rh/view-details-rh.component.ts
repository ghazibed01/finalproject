import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RhService } from '../services/rh.service';
import { User } from 'app/admin/rh/model/User'; 
import { MatDialog } from '@angular/material/dialog';
import { EditRhComponent } from './dialogs/edit-rh/edit-rh.component'; 

@Component({
  selector: 'app-view-details-rh',
  templateUrl: './view-details-rh.component.html',
  styleUrls: ['./view-details-rh.component.scss']
})
export class ViewDetailsRhComponent implements OnInit {
  public rh: User | undefined;
  public isLoading = true;
  isInputDisabled: boolean = true;
  convertedImg:any;
  username: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  constructor(
    private route: ActivatedRoute,
    private rhService: RhService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    
    this.getRhDetails();
  }
  private convertImageData(base64Data: string): string {
    return `data:image/png;base64,${base64Data}`;
  }
  getRhDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.rhService.getUserById(Number(id)).subscribe(
        (rh: User) => {
          this.rh = rh;
          this.rh.id=id;
          this.convertedImg = this.convertImageData(rh.imageData);
          console.log("idgetDetails",this.rh.id)
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching Rh details:', error);
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
    this.rhService.updatePassword(formData)
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
    const dialogRef = this.dialog.open(EditRhComponent, {
      width: '600px',
      height: '650px',
      data: { pm: this.rh } ,
     
      
    });
console.log(this.rh)
console.log("test",this.rh?.id)
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getRhDetails();
      this.isLoading = true;
    });
  }
}


