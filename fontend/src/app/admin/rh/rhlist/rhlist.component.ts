import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Direction } from '@angular/cdk/bidi';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../model/User';
import { RhService } from '../services/rh.service';
import { AddRhComponent } from './dialog/add-rh/add-rh.component'; 
import { DeleteRhComponent } from './dialog/delete-rh/delete-rh.component'; 
import { EditRhComponent } from '../view-details-rh/dialogs/edit-rh/edit-rh.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rhlist',
  templateUrl: './rhlist.component.html',
  styleUrls: ['./rhlist.component.scss']
})
export class RhlistComponent implements OnInit {

  displayedColumns: string[] = ['select','imageData','username','gender','department','mobile','email', 'information','joiningDate', 'actions'];
  dataSource!: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);
  exampleDatabase?:RhService

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;

  public rhs: User[] = [];
  public searchTerm: string = '';
  constructor(
    private rhService: RhService,
    private dialog: MatDialog,
    public httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.loadData(); // Initialise dataSource ici
    this.dataSource = new MatTableDataSource<User>([]);
    this.dataSource.sort = this.sort;
    this.loadData();
   
    // Autres appels de méthodes ici...
  }
  refresh() {
    this.loadData();
  }

  private convertImageData(base64Data: string): string {
    return `data:image/png;base64,${base64Data}`;
  }

  public loadData(): void {
    this.rhService.getRhs().subscribe(
      (data: User[]) => {
        this.dataSource.data = data; // Initialize dataSource with the fetched data
        console.log("data", data);

        // Convert image data for each user
        data.forEach((element: any) => {
          if (element.imageData) {
            element.convertedImg = this.convertImageData(element.imageData);
          } else {
            console.log("else")
          //  element.convertedImg = 'assets/images/icons/default-image.png'; // Fallback image
          }
        });
      },
      (error: HttpErrorResponse) => {
        console.error("Error fetching Rh list :", error.message);
      }
    );
  }


  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

openAddModal(): void {
  const dialogRef = this.dialog.open(AddRhComponent, {
    width: '700px', // Définir la largeur de la modal selon vos besoins
    height: '730px',
    // Autres configurations de la modal
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // Traiter les données retournées par la modal si nécessaire
    this.refresh();
  });
}

  

  

  openDeleteModal(rh: User): void {
    const dialogRef = this.dialog.open(DeleteRhComponent, {
      width: '400px',
      data: rh 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Delete modal closed with result:', result);
      if (result === true) {
        this.rhService.removePM(rh.id).subscribe(() => {
          console.log('RH successfully removed from the database');
          this.rhs = this.rhs.filter(a => a !== rh);
          this.showNotification(
            'snackbar-success',
            ' RH Delete Successfully...!!!',
            'bottom',
            'center'
          );
          this.refresh();
        }, (error) => {
          console.error('Error removing RH from the database:', error);
          this.showNotification('error', 'Failed to delete RH', 'bottom', 'right');
          // Afficher un message d'erreur ou gérer l'erreur autrement
        });
      }
    });
  }
  
 
  
  onCancelClick(): void {
    console.log('Delete operation canceled.');
  }

  
  
  viewRhDetails(rh: User): void {
    // Navigate to the details page with the ID of the selected vaccine
    this.router.navigate(['/admin/rh/view/details/rh', rh.id]);
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
  exportExcel() {
    const exportData: Partial<Record<string, any>>[] = this.dataSource.filteredData.map((rh) => ({
      'Full Name': rh.username,
      'Email': rh.email,
      'Description': rh.information,
      'Department': rh.department,
      'Address': rh.address
    }));
  
    TableExportUtil.exportToExcel(exportData, 'rh');
  }
}



