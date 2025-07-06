
import { Injectable } from '@angular/core';
import * as Stomp  from "stompjs" ;
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private messageSubject = new Subject<any>();

  connect() {
    const socket = new SockJS('http://localhost:8090/ws');
    this.stompClient = Stomp.over(socket);
    
    const that = this;
    this.stompClient.connect({}, function (frame: any) {
      that.stompClient.subscribe('/user/queue/messages', (message: any) => {
        if (message.body) {
          that.messageSubject.next(JSON.parse(message.body));
        }
      });
    });
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  sendMessage(destination: string, message: any) {
    this.stompClient.send(destination, {}, JSON.stringify(message));
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }
}
