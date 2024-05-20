import { Injectable } from '@angular/core';
interface Event {
  id: number;
  date: string;
  title: string;
  description: string;
}
@Injectable({
  providedIn: 'root'
})
export class EventService {

  private events: Event[] = [];
  private eventIdCounter: number = 1;

  constructor() {}

  addEvent(date: string, title: string, description: string): void {
    const event = { id: this.eventIdCounter++, date, title, description };
    this.events.push(event);
  }

  deleteEvent(eventId: number): void {
    const index = this.events.findIndex(event => event.id === eventId);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  getEvents(): Event[] {
    return this.events;
  }

  getEventsOnDate(date: Date): Event[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  }
}
