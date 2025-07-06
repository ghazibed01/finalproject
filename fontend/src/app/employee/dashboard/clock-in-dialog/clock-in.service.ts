
import { HttpClient , HttpHeaders , HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '@core/service/storage.service';
import { ClockIn } from './ClockIn'; 
import { catchError } from 'rxjs/operators';
const API_URL = 'http://localhost:8090/api/test/';

@Injectable({
  providedIn: 'root'
})
export class ClockInService {
  constructor(private http: HttpClient) {}
   /** Fetches a single calendar event by ID */
  getClockIn(id: number): Observable<ClockIn> {
    return this.http.get<ClockIn>(`${API_URL}Calendar/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  /** Fetches all calendar events */
  getAllClockIns(): Observable<ClockIn[]> {
    return this.http.get<ClockIn[]>(`${API_URL}allCheckIn`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  /** Fetches all calendar events for the current user */
  getClockInsByUserId(): Observable<ClockIn[]> {
    const userId = StorageService.getUserId();  // Get current user ID from storage
    return this.http.get<ClockIn[]>(`${API_URL}calendars/user/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  /** Creates a new calendar event */
  createClockIn(calendar: ClockIn): Observable<ClockIn> {
    calendar.userId = StorageService.getUserId();
    calendar.userName =StorageService.getUsername();
    calendar.userEmail =StorageService.getUseremail();
    return this.http.post<ClockIn>(`${API_URL}addChechIn`, calendar, {
      headers: this.createAuthorizationHeader(),
    });
  }

  /** Updates an existing calendar event */
  updateClockIn(id: number, calendar: ClockIn): Observable<ClockIn> {
    return this.http.put<ClockIn>(`${API_URL}updateCalendar/${id}`, calendar, {
      headers: this.createAuthorizationHeader(),
    });
  }

  /** Deletes a calendar event */
  deleteClockIn(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}deleteCalendar/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  /** Creates authorization headers */
  createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization', 'Bearer ' + StorageService.getToken()
    );
  }
}