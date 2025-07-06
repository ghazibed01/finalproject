import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, throwError } from 'rxjs';
import { User } from '../models/user';
const API_URL = 'http://localhost:8076/api/';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})


export class AuthService {

  private authAPI = API_URL + 'auth/';

private currentUserSubject: BehaviorSubject<User | null>;
public currentUser: Observable<User | null>;

constructor(private http: HttpClient) {
  this.currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  this.currentUser = this.currentUserSubject.asObservable();
}

public get currentUserValue(): User | null {
  return this.currentUserSubject.value;
}


  login(username: string, password: string): Observable<any>  {
    return this.http.post(this.authAPI + 'signin' ,
    {
        username,
        password,
      },httpOptions).pipe(
        catchError(this.handleError)
      );


    /*  .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes

          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );*/
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error.message}`);
    }
    return throwError(error.error.message || 'Something bad happened; please try again later.');
  }
  //const roles = Array.from(this.roles);

  register(username: string, email: string, password: string,roles: string[]): Observable<any> {
    return this.http.post(
      this.authAPI + 'signup',
      {
        username,
        email,
        password,
       roles: Array.from(roles)
      },
      httpOptions
    );
  }
  static readonly ConfirmPath = '/auth/activate-account';
  confirm(token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.get(`${this.authAPI}activate-account`, { params });
  }

logout(): Observable<any> {
  localStorage.clear(); // on vide tout
  this.currentUserSubject.next(null); // on remet à null
  return of({ success: true });
}

}
