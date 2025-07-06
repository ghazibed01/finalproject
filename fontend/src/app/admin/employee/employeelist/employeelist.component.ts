
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
import { EmployeeService } from './../services/employee.service';
import { AddEmployeeComponent } from './dialog/add-employee/add-employee.component';
import { DeleteEmployeeComponent } from './dialog/delete-employee/delete-employee.component';
import { EditEmployeeComponent } from '../view-details-employee/dialogs/edit-employee/edit-employee.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-employeelist',
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.scss']
})
export class EmployeelistComponent implements OnInit {

  displayedColumns: string[] = ['select','imageData','username','gender','department','mobile','email', 'information','joiningDate', 'actions'];
  dataSource!: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);
  exampleDatabase?:EmployeeService

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;

  public employees: User[] = [];
  public searchTerm: string = '';
  constructor(
    private employeeService: EmployeeService,
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
    this.employeeService.getEmployee().subscribe(
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

  
  // public getAllEmployees(): void {
  //   this.employeeService.getAllAllergies().subscribe(
  //     (response: User[]) => {
  //       this.employees = response;
  //       console.log(this.employees);
  //     },
  //     (error: HttpErrorResponse) => {
  //       alert(error.message);
  //     }
  //   );
  // }
  // public searchEmployees(key: string): void {
  //   console.log(key); // Affiche la clé de recherche dans la console
  //   if (key.trim() !== '') { // Vérifie si la clé de recherche n'est pas vide
  //     const results: User[] = [];
  //     for (const employee of this.employees) {
  //       if (employee.username.toLowerCase().includes(key.toLowerCase())
  //         || employee.department.toLowerCase().includes(key.toLowerCase())
  //         || employee.email.toLowerCase().includes(key.toLowerCase())) {
  //         results.push(employee);
  //       }
  //     }
  //     this.employees = results; 
  //   } else {
  //     this.getAllEmployees(); 
  //   }
  // }
  

  openDeleteModal(employee: User): void {
    const dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      width: '400px',
      data: employee 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Delete modal closed with result:', result);
      if (result === true) {
       
        this.employeeService.removePM(employee.id).subscribe(() => {
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

  
 
  viewEmployeeDetails(employee: User): void {
    // Navigate to the details page with the ID of the selected vaccine
    this.router.navigate(['/admin/employee/view/details/employee', employee.id]);
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
    const exportData: Partial<Record<string, any>>[] = this.dataSource.filteredData.map((employee) => ({
      'Full Name': employee.username,
      'Email': employee.email,
      'Description': employee.information,
      'Department': employee.department,
      'Address': employee.address
    }));
  
    TableExportUtil.exportToExcel(exportData, 'employee');
  }
}



