import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';  
import { catchError } from 'rxjs/operators'; 
import { AbsenceService } from 'app/admin/absence/service/absence.service';
import { MatDialog } from '@angular/material/dialog';
import { PdfViewerDialogComponent } from './pdf-viewer-dialog/pdf-viewer-dialog.component';
import Swal from 'sweetalert2';

interface FileWithMeta {
  name: string;
  content: Blob;
}

@Component({
  selector: 'app-project-records',
  templateUrl: './project-records.component.html',
  styleUrls: ['./project-records.component.scss'],
})
export class ProjectRecordsComponent implements OnInit {

  absenceId!: number;
  absence: any;
  
  errorMessage: string = '';
  pdfUrl: SafeResourceUrl | null = null;
  isPdfVisible: boolean = false;
  sowUrl: SafeResourceUrl | null = null;
  issowVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private absenceService: AbsenceService,

    private dialog:MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.absenceId = +params['absenceId'];
    });
    this.getAbsence(this.absenceId);
   
  }

  getAbsence(absenceId: number): void {
    this.absenceService.getAbsence(absenceId).subscribe({
      next: (absence) => {
        this.absence = absence;
      },
      error: (error) => {
        console.error('Failed to load absence', error);
        this.errorMessage = 'Failed to load absence details';
      }
    });
  }



///////////////////////pdf view///////////



/*load(absenceId: number): void {
  this.absenceService.getJustifByAbsenceId(absenceId).subscribe(
    (response: Blob) => {
      const url2 = window.URL.createObjectURL(response); // Create object URL from Blob
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url2); // Sanitize URL
      this.isPdfVisible = true; // Show PDF
    },
    (error) => {
      console.error("Error loading UML", error);
    }
  );
}*/

 
load(absenceId: number): void {
  this.absenceService.getJustifByAbsenceId(absenceId).pipe(
    catchError((error) => {
      console.error("Erreur lors du chargement du PDF", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de récupérer la justification PDF.',
        confirmButtonColor: '#d33'
      });
      return of(null); // retourne null si erreur
    })
  ).subscribe((response: Blob | null) => {
    if (!response || response.size === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Fichier introuvable',
        text: 'Aucun document PDF trouvé pour cette absence.',
        confirmButtonColor: '#f48fb1'
      });
      return;
    }

    this.dialog.open(PdfViewerDialogComponent, {
      width: '80%',
      data: { blob: response }
    });
  });
}

closePdf(): void {
  this.isPdfVisible = false;
  this.pdfUrl = null; // Clear URL when closing
}

}