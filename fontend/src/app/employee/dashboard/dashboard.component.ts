
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Calendar } from 'app/calendar/calendar.model';
import { CalendarService } from 'app/calendar/calendar.service';
import { StorageService } from '@core/service/storage.service';
import { FormsDialogComponent } from './form-dialog/form-dialog.component'; 
import { ClockInDialogComponent } from './clock-in-dialog/clock-in-dialog.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName?: string;
  userId?: number;
  userLeaves: Calendar[] = [];

  constructor(
    private storageService: StorageService,
    private calendarService: CalendarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();
    this.userName = user.username;
    this.userId = user.id;
    this.loadUserLeaves();
  }

  /** Load the leaves for the current user */
  loadUserLeaves(): void {
    this.calendarService.getCalendarsByUserId().subscribe({
      next: (leaves: Calendar[]) => {
        this.userLeaves = leaves;
        console.log("my leaves" , this.userLeaves)
      },
      error: (err) => {
        console.error('Error loading user leaves:', err);
      }
    });
  }

  /** Open dialog to add a new leave */
  addNewLeave(): void {
    const dialogRef = this.dialog.open(FormsDialogComponent, {
      data: {
        calendar: {} as Calendar,
        action: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'submit') {
        this.loadUserLeaves(); // Refresh after adding
      }
    });
  }
  openPunchInDialog(): void {
  const dialogRef = this.dialog.open(ClockInDialogComponent, {
    width: '400px',
    data: {}
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'submit') {
      console.log('Punch-in saved successfully.');
    }
  });
}
}