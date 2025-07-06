
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from './dialog/form-dialog/form-dialog.component';
import { Router } from '@angular/router'; 
import { Absence } from '../model/Absence';
import { AbsenceService } from '../service/absence.service';
import {
  TableExportUtil,
  TableElement
} from '@shared';
import { formatDate } from '@angular/common';

import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importez l'opérateur map ici

import { AddFileComponent } from './dialog/add-file/add-file.component';
@Component({
  selector: 'app-allabsence',
  templateUrl: './allabsence.component.html',
  styleUrls: ['./allabsence.component.scss'],
})
export class AllAbsenceComponent implements OnInit
{
  absences: Absence[] = [];
  displayedColumns: string[] = ['userName','justification', 'startDate', 'endDate','description', 'status','done','reject'];

  constructor(private absenceService: AbsenceService , private router: Router ,public dialog: MatDialog) {}

 
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadAbsences(); 
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

   setStatusToRject(absence: Absence): void {
    this.absenceService.reject(absence.id).subscribe({
      next: (updatedAbsence) => {
        absence.status = updatedAbsence.status; 
        console.log('Absence status updated to Rject successfully:', updatedAbsence);
      },
      error: (error) => {
        console.error('Failed to update absence status to DONE:', error);
      }
    });
  }
  refresh() {
    this.loadAbsences();
  }
addNew(): void {
  const dialogRef = this.dialog.open(FormDialogComponent, {
    width: '600px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'submit') {
      this.loadAbsences();  
    }
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
  loadAbsences(): void {
    this.absenceService.getAbsences().subscribe(
      (data: Absence[]) => {
        this.absences = data;
      },
      error => {
        console.error('There was an error loading the absences!', error);
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
