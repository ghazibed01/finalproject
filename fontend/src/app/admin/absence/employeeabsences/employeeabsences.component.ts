
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from '../allabsence/dialog/form-dialog/form-dialog.component';
import { Router } from '@angular/router';
import { Absence } from '../model/Absence';
import { AbsenceService } from '../service/absence.service';
import {
  TableExportUtil,
  TableElement
} from '@shared';
import { formatDate } from '@angular/common';
import { AddFileComponent } from '../allabsence/dialog/add-file/add-file.component';
import { StorageService } from '@core/service/storage.service';
@Component({
  selector: 'app-employeeabsences',
  templateUrl: './employeeabsences.component.html',
  styleUrls: ['./employeeabsences.component.scss']
})


export class EmployeeAbsencesComponent implements OnInit {

   absences: Absence[] = [];
   displayedColumns: string[] = ['userName','justification', 'startDate', 'endDate','description', 'status','actions'];

   constructor(private absenceService: AbsenceService , private router: Router ,public dialog: MatDialog , private storageService: StorageService,) {}


   @ViewChild(MatPaginator, { static: true })
   paginator!: MatPaginator;
  ngOnInit(): void {
    this.loadAbsencesByUserId();
  }

 // Function to dynamically assign a color class based on the index
 getChipClass(index: number): string {
   const chipClasses = ['chip-red', 'chip-pink', 'chip-blue', 'chip-green', 'chip-orange', 'chip-purple', 'chip-yellow'];
   return chipClasses[index % chipClasses.length]; // Use modulus to cycle through available classes
 }

   setStatusToDone(absence: Absence): void {
     this.absenceService.done(absence.id).subscribe({
       next: (updatedAbsence) => {
         absence.status = updatedAbsence.status;
         console.log('Absence status updated to DONE successfully:', updatedAbsence);
       },
       error: (error) => {
         console.error('Failed to update absence status to DONE:', error);
       }
     });
   }
   refresh() {
       this.loadAbsencesByUserId();
   }
   addNew() {

     const dialogRef = this.dialog.open(FormDialogComponent, {
       width: '680px', // Définir la largeur de la modal selon vos besoins
       height: '680px',
       // Autres configurations de la modal
     });
   }

     // export table data in excel file
   exportExcel() {
     // key name with space add in brackets
     const exportData: Partial<TableElement>[] =
       this.absences.map((x) => ({
         Name: x.userName,
         StartDate: formatDate(new Date(x.startDate), 'yyyy-MM-dd', 'en') || '',
         EndDate: formatDate(new Date(x.endDate), 'yyyy-MM-dd', 'en') || '',
       }));

     TableExportUtil.exportToExcel(exportData, 'excel');
   }


  loadAbsencesByUserId(): void {
    const userId = StorageService.getUserId();
    console.log("userId",userId)
    this.absenceService.getAbsencesByUserId(userId).subscribe(
      (data: Absence[]) => {
        this.absences = data;
      },
      error => {
        console.error('Error loading absences by user ID:', error);
      }
    );
  }


   deleteAbsence(absenceId: number): void {
     if (confirm('Are you sure you want to delete this absence?')) {
       this.absenceService.deleteAbsence(absenceId).subscribe(
         () => {
           this.absences = this.absences.filter(absence => absence.id !== absenceId);
           alert('Absence deleted successfully!');
         },
         error => {
           console.error('There was an error deleting the absence!', error);
         }
       );
     }
   }
   onAbsenceClick(absenceId: number): void {
     this.router.navigate(['/task'], { queryParams: { absenceId: absenceId } });
   }
   onAbsenceFile(absenceId: number): void {
     const dialogRef = this.dialog.open(AddFileComponent, {
       data: { absenceId },
     });
   }
   onAbsenceRecord(absenceId: number): void {
     this.router.navigate(['employee/records'], { queryParams: { absenceId: absenceId } });
   }
 }
