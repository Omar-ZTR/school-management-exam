import { Component } from '@angular/core';
import { EventService } from './event.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  eventDate: string = '';
  eventTitle: string = '';
  eventDescription: string = '';

  constructor(private eventService: EventService) {}

  addEvent(): void {
    if (this.eventDate && this.eventTitle) {
      this.eventService.addEvent(this.eventDate, this.eventTitle, this.eventDescription);
      this.eventDate = '';
      this.eventTitle = '';
      this.eventDescription = '';
    }
  }
}
