import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgbModal, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  salle:string;
  color: {
    primary: string;
    secondary: string;
  };
}

@Component({
  selector: 'app-calandarfull',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule, CommonModule],
  templateUrl: './calandarfull.component.html',
  styleUrls: ['./calandarfull.component.css'],
})
export class CalandarfullComponent implements OnInit {
  daysInMonth: number[] = [];
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  monthName: string = '';
  eventForm: FormGroup;
  events: { [key: string]: CalendarEvent[] } = {}; // Stores events keyed by date
  weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  isMonthView: boolean = true; // Toggle between month view and week view
  currentWeekStart: Date = new Date();

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      salle: ['', Validators.required],
      color: this.fb.group({
        primary: ['#10c634', Validators.required],
        secondary: ['#676670', Validators.required]
      })
    });
  }
  salles: Array<{ id: number, name: string }> = [
    { id: 1, name: 'Salle A' },
    { id: 2, name: 'Salle B' },
    { id: 3, name: 'Salle C' },
  ];

  ngOnInit(): void  {
    this.generateCalendar();
    this.generateCurrentWeek();
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      salle: ['', Validators.required],
      color: this.fb.group({
        primary: ['#000000']
      })
    });
  }

  openWeekView(day: number) {
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = selectedDate.getDay();
    startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);
  
    this.currentWeekStart = startOfWeek;
    this.isMonthView = false;
    this.generateCurrentWeek();
  }

  changeWeek(offset: number) {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + (offset * 7));
    this.generateCurrentWeek();
    const mmdate  = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    console.log(this.currentWeekStart)
    console.log("aaaaaaaaa",mmdate)
  }
  
  toggleView() {
    this.isMonthView = !this.isMonthView;
    if (!this.isMonthView) {
      // Set currentWeekStart to the start of the first week of the current month
      const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
      const dayOfWeek = firstDayOfMonth.getDay();
      this.currentWeekStart = new Date(firstDayOfMonth);
      this.currentWeekStart.setDate(firstDayOfMonth.getDate() - dayOfWeek);
      this.generateCurrentWeek();
    }
  }
  
  generateCurrentWeek() {
    const startOfWeek = new Date(this.currentWeekStart);
    this.currentWeekStart = new Date(startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()));
  }
  
  getWeekDates(): Date[] {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + i);
      return date;
    });
  }
  
  previous() {
    if (this.isMonthView) {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.generateCalendar();
    } else {
      this.changeWeek(-1);
    }
  }
  
  next() {
    if (this.isMonthView) {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.generateCalendar();
    } else {
      this.changeWeek(1);
    }
  }
  generateCalendar() {
    const date = new Date(this.currentYear, this.currentMonth, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    this.monthName = `${monthName} ${this.currentYear}`;
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

 
openEventForm(date: Date, hour: string, modal: any): void {
  const formattedDate = date.toISOString().split('T')[0];
  const formattedTime = `${hour}:00`;

  this.eventForm.patchValue({
    startDate: formattedDate,
    startTime: formattedTime,
    endTime: formattedTime,
    salle: ''
  });

  // Open the modal
  this.modalService.open(modal);
}
  // saveEvent() {
  //   if (this.eventForm.valid) {
  //     const formValues = this.eventForm.value;
  //     const eventData: CalendarEvent = {
  //       title: formValues.title,
  //       start: `${formValues.startDate}T${formValues.startTime}`,
  //       end: `${formValues.startDate}T${formValues.endTime}`,
  //       color: formValues.color,
  //       salle: formValues.salle
  //     };
  //     const eventDate = formValues.startDate;

  //     if (!this.events[eventDate]) {
  //       this.events[eventDate] = [];
  //     }

  //     this.events[eventDate].push(eventData);
  //     console.log(this.events); // For debugging purposes
  //     this.modalService.dismissAll();
  //   }
  //   else{
  //     console.log("fghjkl;")
  //   }
  // }

  saveEvent() {
    if (this.eventForm.valid) {
      const formValues = this.eventForm.value;
      const eventData: CalendarEvent = {
        title: formValues.title,
        start: `${formValues.startDate}T${formValues.startTime}`,
        end: `${formValues.startDate}T${formValues.endTime}`,
        color: formValues.color,
        salle: formValues.salle
      };
      const eventDate = formValues.startDate;
  
      if (!this.events[eventDate]) {
        this.events[eventDate] = [];
      }
  
      this.events[eventDate].push(eventData);
      console.log('Events:', this.events); // For debugging purposes
      this.modalService.dismissAll();
    } else {
      console.log('Invalid form controls:');
      this.logInvalidControls(this.eventForm);
    }
  }
  

// Helper method to log invalid controls
logInvalidControls(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    if (control && control.invalid) {
      console.log(`Control: ${key}, Status: ${control.status}, Errors: `, control.errors);
    }
    if (control instanceof FormGroup) {
      this.logInvalidControls(control);
    }
  });
}





  hasEvents(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day).toISOString().split('T')[0];
    return this.events[date] && this.events[date].length > 0;
  }

  hasEvent(date: Date, hour: string): boolean {
    const dateString = date.toISOString().split('T')[0];
    const eventHour = hour.split(':')[0];
  
    if (this.events[dateString]) {
      return this.events[dateString].some(event => {
        const eventStartHour = new Date(event.start).getHours().toString();
        return eventStartHour === eventHour;
      });
    }
    return false;
  }
  isEvent(date: Date, hour: string): boolean {
    const dateString = date.toISOString().split('T')[0];
    const hourValue = parseInt(hour.split(':')[0], 10);
    const minuteValue = parseInt(hour.split(':')[1], 10);
  
    if (this.events[dateString]) {
      return this.events[dateString].some(event => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
  
        const eventStartHour = eventStart.getHours();
        const eventEndHour = eventEnd.getHours();
        const eventStartMinute = eventStart.getMinutes();
        const eventEndMinute = eventEnd.getMinutes();
  
        if (eventStartHour === hourValue && minuteValue < 15) {
          return true;
        }
  
        if (eventEndHour === hourValue && minuteValue > 45) {
          return true;
        }
  
        const eventStartTotalMinutes = eventStartHour * 60 + eventStartMinute;
        const eventEndTotalMinutes = eventEndHour * 60 + eventEndMinute;
        const currentTotalMinutes = hourValue * 60 + minuteValue;
  
        return currentTotalMinutes >= eventStartTotalMinutes && currentTotalMinutes < eventEndTotalMinutes;
      });
    }
  
    return false;
  }
  
  getEventStyles(date: Date, hour: string): { [key: string]: string } {
    const dateString = date.toISOString().split('T')[0];
    const hourValue = parseInt(hour.split(':')[0], 10);
    const minuteValue = parseInt(hour.split(':')[1], 10);
    
    let styles = {
      'width': '10%',
      'height': 'auto',
      'transform': `translateY(0px)`,
      'z-index': '99',
      'background-color': 'transparent'
    };
  
    console.log('Checking event styles for:', dateString, hour);
  
    if (this.events[dateString]) {
      const event = this.events[dateString].find(event => {
        const eventStart = new Date(event.start);
        return eventStart.getHours() === hourValue;
      });
  
      if (event) {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const durationMinutes = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);
        const minute = eventStart.getMinutes();
  
        styles = {
          'width': '9%',
          'height': `${durationMinutes}px`,
          'transform': `translateY(${minute}px)`,
          'z-index': '99',
          'background-color': event.color.primary
        };
  
        console.log('Event found:', event);
        console.log('Styles:', styles);
      }
    }
  
    return styles;
  }
  getEventsForDateAndHour(date: Date, hour: string): CalendarEvent[] {
    const dateString = date.toISOString().split('T')[0];
    const eventHour = parseInt(hour.split(':')[0], 10);
  
    if (this.events[dateString]) {
      return this.events[dateString].filter(event => {
        const eventStart = new Date(event.start);
        const eventHourStart = eventStart.getHours();
        const eventHourEnd = new Date(event.end).getHours();
  
        return eventHour >= eventHourStart && eventHour < eventHourEnd;
      });
    }
  
    return [];
  }
  
  getHoursOfDay(): string[] {
    return Array.from({ length: 11 }, (_, i) => `${i + 8}:00`);
  }
}
