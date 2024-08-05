import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/servicesUtils/chat.service';
import { interval, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ResetPasswordComponent } from "../reset-password/reset-password.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ResetPasswordComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  messageInput: string = '';
  private intervalSubscription: Subscription | undefined;
  chat: any;

  constructor(private chatService: ChatService,private messageService: MessageService) {}

  ngOnInit(): void {
    // Call getMessages every second
  //   this.intervalSubscription = interval(5000).subscribe(() => {
  //     this.chatService.getChat().subscribe(
  //       (data: any) => {
  //         // Update messages or handle the response here
  //         console.log('sasa chats', data);
  // this.chat = data
  
  //       },
  //       (error: { error: { message: any } }) => {
  //         console.log('errrr', error);
  //       }
  //     );
  //   });
  }

  ngOnDestroy(): void {
    // Clean up the subscription when the component is destroyed
    // if (this.intervalSubscription) {
    //   this.intervalSubscription.unsubscribe();
    // }
  }

  getMessages(): void {
    this.chatService.getChat().subscribe(
      (data: any) => {
        // Update messages or handle the response here
        console.log('sasa chats', data);
this.chat = data

      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
      }
    );
  }
  sendMessage(): void {
    const message = this.messageInput.trim();
    if (message) {
      this.messages.push(message);
      this.messageInput = '';
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
const data = {
  senderId : 1,
      senderRole:'student',
      recipientId:2,
      recipientRole:'teacher',
      message: message,
}
      this.chatService.createmessage(data).subscribe(
        (data: any) => {
          alert('Successfully create');
          console.log('seccess', data);
          // this.chat.push(data)
          this.getMessages()
          console.log('dsasqwer', this.chat);
        },
        (error: { error: { message: any } }) => {
          console.log('errrr', error);
        }

      )




      // this.fakeMessage();
    }
  }

  // fakeMessage(): void {
  //   const fakeResponse = this.fakeResponses[Math.floor(Math.random() * this.fakeResponses.length)];
  //   setTimeout(() => {
  //     this.messages.push(fakeResponse);
      
  //   }, 1000 + (Math.random() * 20) * 100);
  // }

  
}
