import { User } from './Model/User';
import { StorageService } from './../../core/service/storage.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from './Service/chat.service'; 
import { WebSocketService } from './Service/web-socket.service'; 
import { ChatMessage } from './Model/ChatMessage'; 
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import 'emoji-picker-element';  // Import the emoji picker web component
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  users: User[] = [];
  selectedUser: User | null = null;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentUserId: number; 
  showEmojiPicker = false;
  convertedImg:any;
  private messageSubscription: Subscription = new Subscription;
  hideRequiredControl = new FormControl(false);
  yourFormControl = new FormControl('');
  constructor(private chatService: ChatService, private webSocketService: WebSocketService,
    private StorageService: StorageService,
  ) {
    const currentUser = this.StorageService.getUser();
    this.currentUserId = currentUser.id;  // 
  }
ngOnInit(): void {
  const currentUser = this.StorageService.getUser();

  this.chatService.getUsers().subscribe(users => {
    // Supprime le current user de la liste
    this.users = users.filter(user => user.id !== currentUser.id);
  });

  this.webSocketService.connect();
  this.messageSubscription = this.webSocketService.getMessageSubject().subscribe(message => {
    this.messages.push(message);
  });
}

ngOnDestroy(): void {
    this.webSocketService.disconnect();
    this.messageSubscription.unsubscribe();
}
 convertImageData(base64Data: string): string {
  return `data:image/png;base64,${base64Data}`;
}

  selectUser(user: User): void {
    this.selectedUser = user;
    if (user.id !== undefined) {
      this.convertedImg = this.convertImageData(user.imageData);
        this.chatService.getChatMessages(user.id).subscribe(messages => {
            this.messages = messages;
        });
    } else {
        // Handle the case where user.id is undefined
        console.error('Selected user ID is undefined');
    }
  }
  sendMessage(): void {
    if (this.selectedUser && this.selectedUser.id !== undefined && this.newMessage.trim() !== '') {
        const user = this.StorageService.getUser();
        if (user.id !== undefined) {
          this.convertedImg = this.convertImageData(this.selectedUser.imageData);
            const message: ChatMessage = {
                senderId: user.id,
                recipientId: this.selectedUser.id,
                content: this.newMessage,
                timestamp: new Date()
            };
            
            // Send the message via the ChatService and WebSocketService
            this.chatService.sendMessage(message).subscribe();
            this.webSocketService.sendMessage('/app/chat', message);

            // Optimistically add the message to the chat
            this.messages.push(message);

            this.newMessage = '';
        } else {
            console.error('Current user ID is undefined');
        }
    } else {
        console.error('Invalid selected user or message');
    }
}
  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(emoji: string | undefined): void {
    if (emoji) {
      this.newMessage += emoji;
    }
  }
}