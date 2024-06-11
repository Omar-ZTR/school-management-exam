import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ExamService } from '../teacher/serviceTeacher/exam.service';
import { CalandarService } from '../teacher/serviceTeacher/calandar.service';
import { GroupService } from '../servicesUtils/group.service';
import { SalleService } from '../servicesUtils/salle.service';
import { TooltipModule } from 'primeng/tooltip';

export interface GroupResponse {
  groupsSubject: any[];
  groupsRank: any[];
}
@Component({
  selector: 'app-calandarfull',
  standalone: true,
  imports: [ReactiveFormsModule,TooltipModule, NgbModalModule, CommonModule],
  templateUrl: './calandarfull.component.html',
  styleUrls: ['./calandarfull.component.css'],
})
export class CalandarfullComponent implements OnInit {
  groupsub: any[] = [];
  grouprnk: any[] = [];
  @Input() data: any;
  @Output() isMonthViewChange = new EventEmitter<boolean>();

  daysInMonth: number[] = [];
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  monthName: string = '';
  eventForm: FormGroup;
  examlist: any;
  // events: { [key: string]: CalendarEvent[] } = {}; // Stores events keyed by date
  weekDays: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  isMonthView: boolean = true; // Toggle between month view and week view
  currentWeekStart: Date = new Date();

  groupSub: any;
  groupRank: any;
  salles: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private examService: ExamService,
    private calandarService: CalandarService,
    private groupService: GroupService,
    private salleService: SalleService
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      salle: ['', Validators.required],
      group: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.generateCalendar();
    this.generateCurrentWeek();
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      salle: ['', Validators.required],
      group: ['', Validators.required],
    });
    this.fetchEvents();
    this.fetchGroups()
  }

  fetchEvents(): void {
    this.calandarService.getEvents().subscribe(
      (data) => {
        this.examlist = data;
        console.log('nnddd', this.examlist);
      },
      (error) => {
        console.error('Error fetching fake questions', error);
      }
    );
  }

  fetchGroups(): void {
    this.groupService.getGroupSubject(this.data).subscribe(
      (data) => {
        console.log('Response from backend:', data);
        this.groupSub = data.groupsSubject;
        this.groupRank = data.groupsRank;
      
      },
      (error: any) => {
        console.error('Error fetching groups', error);
      }
    );
  }

  onSalleSelect(): void {
    const startDate = this.eventForm.get('startDate')?.value;
    const startHour = this.eventForm.get('startTime')?.value;
    const endHour = this.eventForm.get('endTime')?.value;
    // const nb__place = this.eventForm.get('nb')?.value;
  
    const fetchSalleData = {
      starthour: new Date(`${startDate}T${startHour}`),
      endhour: new Date(`${startDate}T${endHour}`),
      // nb: nb__place,
    };
    console.log("<>><<>><><><><<>", fetchSalleData)
    this.fetchSalles(fetchSalleData);
  }
  
  fetchSalles(fetchSalleData: {
    starthour: Date;
    endhour: Date;
    // nb: any;
  }): void {
    this.salleService.getSalleSpecific(fetchSalleData).subscribe(
      (data) => {
        this.salles = data;
        console.log("<>><<>><><><><<>", data)
      },
      (error) => {
        console.error('Error fetching salles', error);
      }
    );
  }
  
  // groupEventsByDate(events: CalendarEvent[]): { [key: string]: CalendarEvent[] } {
  //   const groupedEvents: { [key: string]: CalendarEvent[] } = {};
  //   events.forEach(event => {
  //     const date = event.start.split('T')[0];
  //     if (!groupedEvents[date]) {
  //       groupedEvents[date] = [];
  //     }
  //     groupedEvents[date].push(event);
  //   });
  //   return groupedEvents;
  // }
  openWeekView(day: number) {
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = selectedDate.getDay();
    startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);

    this.currentWeekStart = startOfWeek;
    this.isMonthView = false;
    this.isMonthViewChange.emit(this.isMonthView);
    this.generateCurrentWeek();
  }

  changeWeek(offset: number) {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + offset * 7);
    this.generateCurrentWeek();
    const mmdate = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();
   
  }

  toggleView() {
    this.isMonthView = !this.isMonthView;
    this.isMonthViewChange.emit(this.isMonthView);
    if (!this.isMonthView) {
      const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
      const dayOfWeek = firstDayOfMonth.getDay();
      this.currentWeekStart = new Date(firstDayOfMonth);
      this.currentWeekStart.setDate(firstDayOfMonth.getDate() - dayOfWeek);
      this.generateCurrentWeek();
    }
  }

  generateCurrentWeek() {
    const startOfWeek = new Date(this.currentWeekStart);
    this.currentWeekStart = new Date(
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    );
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
    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  openEventForm(date: Date, hour: string, modal: any): void {
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = `${hour}:00`;

    this.eventForm.patchValue({
      startDate: formattedDate,
      startTime: formattedTime,
      endTime: formattedTime,
      salle: '',
    });

    // Open the modal
    this.modalService.open(modal);
  }

  logInvalidControls(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control && control.invalid) {
        console.log(
          `Control: ${key}, Status: ${control.status}, Errors: `,
          control.errors
        );
      }
      if (control instanceof FormGroup) {
        this.logInvalidControls(control);
      }
    });
  }

  isEvent(date: Date, hour: string): boolean {
    const dateString = date.toISOString().split('T')[0];
    const hourValue = parseInt(hour.split(':')[0], 10);
    const minuteValue = parseInt(hour.split(':')[1], 10);

    if (this.examlist) {
      return this.examlist.some(
        (event: { startDate: string | number | Date }) => {
          const eventStartDate = new Date(event.startDate)
            .toISOString()
            .split('T')[0];
          const eventStartHour = new Date(event.startDate).getHours();
          const eventStartMinute = new Date(event.startDate).getMinutes();

          return (
            eventStartDate === dateString &&
            eventStartHour === hourValue &&
            eventStartMinute >= 0 &&
            eventStartMinute < 60
          );
        }
      );
    }

    return false;
  }

  isEventForDateAndHour(event: any, date: Date, hour: string): boolean {
    const eventStartDate = new Date(event.startDate)
      .toISOString()
      .split('T')[0];
    const eventStartHour = new Date(event.startDate).getHours();
    const eventStartMinute = new Date(event.startDate).getMinutes();

    const dateString = date.toISOString().split('T')[0];
    const hourValue = parseInt(hour.split(':')[0], 10);

    return eventStartDate === dateString && eventStartHour === hourValue;
  }

  // Update the hasEvents function to work with examlist
  hasEvents(day: number): boolean {
    if (this.examlist) {
      const date = new Date(this.currentYear, this.currentMonth, day)
        .toISOString()
        .split('T')[0];
      return this.examlist.some(
        (event: { startDate: string | number | Date }) => {
          const eventDate = new Date(event.startDate)
            .toISOString()
            .split('T')[0];
          return eventDate === date;
        }
      );
    }

    return false;
  }

  // hasEvents(day: number): boolean {
  //   const date = new Date(this.currentYear, this.currentMonth, day).toISOString().split('T')[0];
  //   return this.events[date] && this.events[date].length > 0;
  // }

  // isEvent(date: Date, hour: string): boolean {
  //   const dateString = date.toISOString().split('T')[0];
  //   const hourValue = parseInt(hour.split(':')[0], 10);
  //   const minuteValue = parseInt(hour.split(':')[1], 10);

  //   if (this.events[dateString]) {
  //     return this.events[dateString].some(event => {
  //       const eventStart = new Date(event.start);
  //       const eventEnd = new Date(event.end);

  //       const eventStartHour = eventStart.getHours();
  //       const eventEndHour = eventEnd.getHours();
  //       const eventStartMinute = eventStart.getMinutes();
  //       const eventEndMinute = eventEnd.getMinutes();

  //       if (eventStartHour === hourValue && minuteValue < 15) {
  //         return true;
  //       }

  //       if (eventEndHour === hourValue && minuteValue > 45) {
  //         return true;
  //       }

  //       const eventStartTotalMinutes = eventStartHour * 60 + eventStartMinute;
  //       const eventEndTotalMinutes = eventEndHour * 60 + eventEndMinute;
  //       const currentTotalMinutes = hourValue * 60 + minuteValue;

  //       return currentTotalMinutes >= eventStartTotalMinutes && currentTotalMinutes < eventEndTotalMinutes;
  //     });
  //   }

  //   return false;
  // }
  getEventStyles(date: Date, hour: string): { [key: string]: string } {
    const dateString = date.toISOString().split('T')[0];
    const hourValue = parseInt(hour.split(':')[0], 10);
    const minuteValue = parseInt(hour.split(':')[1], 10);
    const colors = [
      '#615EFC',
      '#7E8EF1',
      '#68D2E8',
      '#121481',
      '#FEEFAD',
      '#FFC55A',
      '#1D24CA',
    ];

    const defaultColor = '#5e83fc'; // Default color if only one event on the same day

    let styles = {
      width: '10%',
      height: 'auto',
      transform: `translateY(0px)`,
      'box-shadow': `0 4px 30px ${defaultColor}`,
      'z-index': '99',
      'background-color': `${defaultColor}33`,
    };

   

    if (this.examlist) {
      const eventsOnSameDay = this.examlist.filter(
        (event: { startDate: string | number | Date }) => {
          const eventStart = new Date(event.startDate);
          return eventStart.toISOString().split('T')[0] === dateString;
        }
      );

      const eventIndex = eventsOnSameDay.findIndex(
        (event: { startDate: string | number | Date }) => {
          const eventStart = new Date(event.startDate);
          return eventStart.getHours() === hourValue;
        }
      );

      if (eventIndex !== -1) {
        const event = eventsOnSameDay[eventIndex];
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        const durationMinutes =
          (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);
        const minute = eventStart.getMinutes();

        // Use default color if there's only one event on the same day
        const colorIndex =
          eventsOnSameDay.length > 1
            ? Math.floor(Math.random() * colors.length)
            : -1;

        styles = {
          width: '90%',
          height: `${durationMinutes}px`,
          transform: `translateY(${minute}px)`,
          'box-shadow': `0 4px 30px ${defaultColor}1A`,
          'z-index': '99',
          'background-color':
            colorIndex !== -1 ? `${colors[colorIndex]}33` : `${defaultColor}33`,
        };

       
      }
    }

    return styles;
  }

  getHoursOfDay(): string[] {
    return Array.from({ length: 11 }, (_, i) => `${i + 8}:00`);
  }

  saveEvent() {
 
    if (this.eventForm.valid) {
      const formValues = this.eventForm.value;
      // For debugging purposes
      this.modalService.dismissAll();

      const calandarData = {
        exam__id: this.data,

        startDate: new Date(`${formValues.startDate}T${formValues.startTime}`),
        endDate: new Date(`${formValues.startDate}T${formValues.endTime}`),
      
  group__name: formValues.group.group__name,
        salle: formValues.salle,
        exam__title: formValues.title,
      };
      console.log('beforzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzze', calandarData);

      this.calandarService.createReserv(calandarData).subscribe(
        (response: any) => {
          alert('Successfully create');
          console.log('seccess create', response);
          this.fetchEvents();
          const examData = {
            exam__id: this.data,
            operation: 1,
            group__id: formValues.group.group__id,
          };

          this.examService.updateExam(examData).subscribe(
            (response: any) => {
              alert('Successfully create');
              console.log('seccess update', response);
            },
            (error: { error: { message: any } }) => {
              console.log('errrr', error);
            }
          );
          // window.location.reload();
        },
        (error: { error: { message: any } }) => {
          console.log('errrr', error);
        }
      );
    } else {
      console.log('Invalid form controls:');
      this.logInvalidControls(this.eventForm);
    }
  }
}
