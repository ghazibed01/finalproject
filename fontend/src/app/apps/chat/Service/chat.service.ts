import { Injectable } from '@angular/core';
import { HttpClient  , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Model/User';
import { ChatMessage } from '../Model/ChatMessage';
import { StorageService } from '@core/service/storage.service';
const apiUrl = 'http://localhost:8090/api/test/';
const apiUrl2 = 'http://localhost:8076/api/test/';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
 
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(apiUrl2+`users`, {
      headers : this.createAutorizationHeader()
    });
  }

  getChatMessages( recipientId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(apiUrl+`messages/${StorageService.getUserId()}/${recipientId}`, {
      headers : this.createAutorizationHeader()
    });
  }

  sendMessage(chatMessage: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(apiUrl+`chat`, chatMessage , {
      headers : this.createAutorizationHeader()
    });
  }
  createAutorizationHeader():HttpHeaders{
    let authHeaders : HttpHeaders= new HttpHeaders();
    return authHeaders.set(
      "Autorization", "Bearer " + StorageService.getToken()
    )
  }
}
