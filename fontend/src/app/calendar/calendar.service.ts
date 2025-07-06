import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Calendar } from './calendar.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '@core/service/storage.service';

const API_URL = 'http://localhost:8090/api/test/';

@Injectable(
  {
    providedIn: 'root'}
)
export class CalendarService {
  constructor(private http: HttpClient) {}

  /** Fetches a single calendar event by ID */
  getCalendar(id: number): Observable<Calendar> {
    return this.http.get<Calendar>(`${API_URL}Calendar/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  /** Fetches all calendar events */
  getAllCalendars(): Observable<Calendar[]> {
    return this.http.get<Calendar[]>(`${API_URL}allCalendar`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  /** Fetches all calendar events for the current user */
  getCalendarsByUserId(): Observable<Calendar[]> {
    const userId = StorageService.getUserId();  // Get current user ID from storage
    return this.http.get<Calendar[]>(`${API_URL}calendars/user/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  /** Creates a new calendar event */
  createCalendar(calendar: Calendar): Observable<Calendar> {
    calendar.userId = StorageService.getUserId();
    calendar.userName =StorageService.getUsername();
    calendar.userEmail =StorageService.getUseremail();
    return this.http.post<Calendar>(`${API_URL}addCalendar`, calendar, {
      headers: this.createAuthorizationHeader(),
    });
  }

  /** Updates an existing calendar event */
  updateCalendar(id: number, calendar: Calendar): Observable<Calendar> {
    return this.http.put<Calendar>(`${API_URL}updateCalendar/${id}`, calendar, {
      headers: this.createAuthorizationHeader(),
    });
  }

  /** Deletes a calendar event */
  deleteCalendar(id: number): Observable<void> {
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