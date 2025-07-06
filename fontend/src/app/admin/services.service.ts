import { StorageService } from '@core/service/storage.service';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const API_URL = 'http://localhost:8076/api/test/';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {


  constructor(private http: HttpClient) { }
  // addProjectManager(formData: FormData): Observable<any> {
  //   // The Content-Type is multipart/form-data, but Angular HttpClient sets it automatically when you pass FormData
  //   return this.http.post(API_URL+`Cuser`, formData, {
  //     headers : this.createAutorizationHeader()
  //   });
   
  // }
  getALL(): Observable<any> {
    return this.http.get<[]>(API_URL + `Allusers`, {
      headers: this.createAutorizationHeader()
    });
  }
  createAutorizationHeader():HttpHeaders{
    let authHeaders : HttpHeaders= new HttpHeaders();
    return authHeaders.set(
      "Autorization", "Bearer " + StorageService.getToken()
    )
  }
}
