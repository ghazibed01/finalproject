
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { MonthlyTicket } from '../model/MonthlyTicket';
import { TicketService } from '../services/ticket.service';
import { Router } from '@angular/router';
import { TableElement, TableExportUtil } from '@shared';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-employeelist',
  templateUrl: './ticketlist.component.html',
  styleUrls: ['./ticketlist.component.scss'],
  animations: [
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class TicketlistComponent implements OnInit {



  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public tickets: MonthlyTicket[] = [];
   displayedColumns: string[] = ['userName','userEmail', 'ticketCount', 'month','year'];

  public searchTerm: string = '';
  constructor(
    private ticketService: TicketService,
    private dialog: MatDialog,
    public httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    ) { }

ngOnInit(): void {

  this.loadTickets(); 
}
  refresh() {
    this.loadTickets();
  }

 loadTickets(): void {
  this.ticketService.getAllTickets().subscribe(
    (data) => {
      this.tickets = data;
      console.log('Tickets:', data);
    },
    (error) => {
      console.error('Error loading tickets:', error);
    }
  );
}

sendMonthlyTicketEmails(): void {
  this.ticketService.sendMonthlyEmails().subscribe(
    (message) => {
      this.showNotification(
        'snackbar-success',
        message,
        'bottom',
        'center'
      );
    },
    (error) => {
      console.error('Error sending monthly email:', error);
      this.showNotification(
        'error',
        'Failed to send monthly emails',
        'bottom',
        'center'
      );
    }
  );
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
       // key name with space add in brackets
       const exportData: Partial<TableElement>[] =
         this.tickets.map((x) => ({
           Name: x.userName,
           Email: x.userEmail,
           Month: x.month,
           Year: x.year,
           TicketCount: x.ticketCount,

         }));
   
       TableExportUtil.exportToExcel(exportData, 'excel');
     }
}



