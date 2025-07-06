
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
import { BehaviorSubject, of, merge, Observable } from 'rxjs';
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
import { AllService } from '../services/all.service';
import { AddEmployeeComponent } from './dialog/add-employee/add-employee.component';
import { DeleteEmployeeComponent } from './dialog/delete-employee/delete-employee.component';
import { EditAllComponent } from '../view-details-all/dialogs/edit-all/edit-all.component';
import { Router } from '@angular/router';
import { ViewDetailsAllComponent } from '../view-details-all/view-details-all.component';
@Component({
  selector: 'app-alllist',
  templateUrl: './alllist.component.html',
  styleUrls: ['./alllist.component.scss']
})
export class AlllistComponent implements OnInit {

  displayedColumns: string[] = ['select','imageData','username','gender','department','mobile','email', 'information','joiningDate', 'roles'];
  dataSource!: MatTableDataSource<User>;
  dataS:User[]=[];
  dataSourceS: User[] =[];
  dataSourceFilter!:Observable<User[]>;
  selection = new SelectionModel<User>(true, []);
  exampleDatabase?:AllService

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;

  public employees: User[] = [];
  public searchTerm: string = '';
  constructor(
    private allService: AllService,
    private dialog: MatDialog,
    public httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.loadData(); // Initialise dataSource ici
    this.dataSource = new MatTableDataSource<User>([]);
    this.dataSource.sort = this.sort;
    this.allService.getAll().subscribe(
      (data: User[]) => {
         this.dataS = data ;
         this.dataSourceS = data;

         data.forEach((element: any) => {
           if (element.imageData) {
             element.convertedImg = this.convertImageData(element.imageData);
           } else {
             console.log("else")
           //  element.convertedImg = 'assets/images/icons/default-image.png'; // Fallback image
           }
         });
       
         console.log('Données récupérées depuis le service user :', this.dataS); 
          // Assigner les données à la propriété dataSource
          this.dataSourceFilter = new BehaviorSubject<User[]>(this.dataSourceS); // Convertir le tableau en Observable
          
      },)
    // Autres appels de méthodes ici...
  }
  refresh() {
    this.loadData();
  }

  private convertImageData(base64Data: string): string {
    return `data:image/png;base64,${base64Data}`;
  }

  public loadData(): void {
    this.allService.getAll().subscribe(
      (data: User[]) => {
        this.dataSource.data = data; // Initialize dataSource with the fetched data
        this.dataSourceS=data;
        this.dataS=data;
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
        console.error("Error fetching project managers:", error.message);
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
// Méthode pour ouvrir la modal d'ajout
openAddModal(): void {
  const dialogRef = this.dialog.open(AddEmployeeComponent, {
    width: '600px', // Définir la largeur de la modal selon vos besoins
    height: '630px',
    // Autres configurations de la modal
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // Traiter les données retournées par la modal si nécessaire
    this.refresh();
  });
}

search(filterValue: string): void {
  console.log("filteralue",filterValue)
  if (filterValue.trim()) {
    const filteredData = this.dataSourceS.filter(user =>
      user.username?.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.address?.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.gender?.toLowerCase().includes(filterValue.toLowerCase()) ||  
    user.email?.toLowerCase().includes(filterValue.toLowerCase())
    );

    this.dataSourceFilter = of(filteredData); // Émettre les données filtrées dans l'observable
    console.log('Données non filtres   :', this.dataSourceS);
    this.dataSourceFilter.subscribe(data => {
      console.log('Données filtrées :', data);
    });
  } else {
    this.dataSourceFilter = of(this.dataS); // Émettre les données non filtrées dans l'observable
    console.log('Données non filtres   :', this.dataSourceS); 
  }
}


  openDeleteModal(employee: User): void {
    const dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      width: '400px',
      data: employee 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Delete modal closed with result:', result);
      if (result === true) {
       
        this.allService.removePM(employee.id).subscribe(() => {
          console.log('Employee successfully removed from the database');
          // Supprimer l'allergie du tableau du modèle
          this.employees = this.employees.filter(a => a !== employee);
          this.showNotification(
            'snackbar-success',
            ' Employee Delete Successfully...!!!',
            'bottom',
            'center'
          );
          this.refresh();
        }, (error) => {
          console.error('Error removing employee from the database:', error);
          this.showNotification('error', 'Failed to delete employee', 'bottom', 'right');
          // Afficher un message d'erreur ou gérer l'erreur autrement
        });
      }
    });
  }
  
 
  
  onCancelClick(): void {
    console.log('Delete operation canceled.');
  }

  
 
  viewEmployeeDetails(user: User): void {
    const dialogRef = this.dialog.open(ViewDetailsAllComponent, {
      width: '600px', // Définir la largeur de la modal selon vos besoins
      height: '500px',
      data:user
      // Autres configurations de la modal
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Traiter les données retournées par la modal si nécessaire
      this.refresh();
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
  exportExcel() {
    const exportData: Partial<Record<string, any>>[] = this.dataSource.filteredData.map((all) => ({
      'Full Name': all.username,
      'Email': all.email,
      'Description': all.information,
      'Department': all.department,
      'Address': all.address
    }));
  
    TableExportUtil.exportToExcel(exportData, 'all');
  }
}



