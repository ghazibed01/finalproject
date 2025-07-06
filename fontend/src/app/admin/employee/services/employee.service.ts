import { StorageService } from '@core/service/storage.service';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/User';
const API_URL = 'http://localhost:8076/api/test/';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  isTblLoading= true;
  constructor(private http: HttpClient){}


  // Méthode pour rechercher des allergies par critères
  public searchAllergies(criteria: string): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}allergies/search?iCriteria=${criteria}`);
  }

  
  ///Project Manager Sercice  Cemployee

  addEmployee(formData: FormData): Observable<any> {
    // The Content-Type is multipart/form-data, but Angular HttpClient sets it automatically when you pass FormData
    return this.http.post(API_URL+`Cemployee`, formData, {
      headers : this.createAutorizationHeader()
    });
   
  }
  updatePM(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${API_URL}UPusers/${id}`, formData, {
      headers: this.createAutorizationHeader()
    });
  }
  uploadProfileImage(userId: number, formData: FormData): Observable<any> {

    return this.http.put(API_URL+`uploadProfileImage/${userId}`,formData,{
      headers: this.createAutorizationHeader(),
      responseType: 'text' 
    });
  }

  public removePM(id: number): Observable<void> {
    console.log('Attempting to remove PM with ID:', id);
    return this.http.delete<void>(`${API_URL}delete/${id}`, {
      headers: this.createAutorizationHeader(),
      
    });
  }
  public getEmployee(): Observable<any> {
      return this.http.get<[]>(API_URL + `employee`, {
        headers: this.createAutorizationHeader()
      });
    }
    getUserById(id: number): Observable<any> {
      return this.http.get<any>(API_URL +`getById/`+ id, {
        headers: this.createAutorizationHeader()
      });
    }
    updatePassword(formData: any): Observable<any> {
      return this.http.post(API_URL +`updatePassword`, formData ,{
        headers: this.createAutorizationHeader(),
        responseType: 'text' 
      });
    }
  createAutorizationHeader():HttpHeaders{
    let authHeaders : HttpHeaders= new HttpHeaders();
    return authHeaders.set(
      "Autorization", "Bearer " + StorageService.getToken()
    )
  }
}