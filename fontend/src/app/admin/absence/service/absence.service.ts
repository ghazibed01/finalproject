import { HttpClient , HttpHeaders , HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '@core/service/storage.service';
import { Absence } from '../model/Absence';
import { catchError } from 'rxjs/operators';
const API_URL = 'http://localhost:8090/api/test/';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  constructor(private http:HttpClient) { }

  getAbsences(): Observable<Absence[]> {
    return this.http.get<Absence[]>(API_URL+"allProjects" ,
      {headers : this.createAutorizationHeader()});
  }

  getAbsence(id: number): Observable<Absence> {
    return this.http.get<Absence>(API_URL+`${id}`,
    {headers : this.createAutorizationHeader()});
  }

  createAbsence(absence: Absence): Observable<Absence> {
    absence.userId = StorageService.getUserId();
    absence.userName =StorageService.getUsername();
    return this.http.post<Absence>(API_URL+"addProject", absence ,
      {headers : this.createAutorizationHeader()});
  }

  updateAbsence(id: number, absence: Absence): Observable<Absence> {
    return this.http.put<Absence>(API_URL+`updateProject/${id}`, absence ,
    {headers : this.createAutorizationHeader()});
  }

  deleteAbsence(id: number): Observable<void> {
    return this.http.delete<void>(API_URL+`deleteProject/${id}`,
    {headers : this.createAutorizationHeader()});
  }
  done(id: number): Observable<Absence> {
    return this.http.put<Absence>(API_URL+`Done/${id}`,
    {headers : this.createAutorizationHeader()});
  }

 reject(id: number): Observable<Absence> {
    return this.http.put<Absence>(API_URL+`Rejected/${id}`,
    {headers : this.createAutorizationHeader()});
  }
  addFilesToAbsence(id: number, files: FileList): Observable<any> {
    const formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
    }

    return this.http.post(`${API_URL}${id}/Addfile`, formData, {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${StorageService.getToken()}`
        }),
        responseType: 'text'  // Specify response type as text if the server sends back text
    }).pipe(
        catchError(error => {
            throw new Error('Failed to upload files: ' + error.message);
        })
    );
}
getFilesByAbsenceId(absenceId: number): Observable<any[]> { // Changed response type to any[]
  return this.http.get<any[]>(`${API_URL}${absenceId}/files`, {
    headers: this.createAutorizationHeader(),
  });
}

 getJustifByAbsenceId(absenceId: number): Observable<Blob> {
  return this.http.get(`${API_URL}${absenceId}/UML`, {
    headers: this.createAutorizationHeader(),
    responseType: 'blob',
  });
}


addJustifToAbsence(id: number, file: File): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('UML', file, file.name);

  return this.http.post(`${API_URL}${id}/AddUML`, formData, {
    headers: this.createAutorizationHeader(),
    responseType: 'text' // Handle non-JSON responses
  }).pipe(
    catchError(error => {
      throw new Error('Failed to upload UML file: ' + error.message);
    })
  );
}



getAbsencesByUserId(userId: number): Observable<Absence[]> {
  return this.http.get<Absence[]>(`${API_URL}absences/user/${userId}`, {
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
