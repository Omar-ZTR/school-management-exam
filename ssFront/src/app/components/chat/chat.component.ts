import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  messageInput: string = '';


  ngOnInit(): void {
   
  }


  sendMessage(): void {
    const message = this.messageInput.trim();
    if (message) {
      this.messages.push(message);
      this.messageInput = '';
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
