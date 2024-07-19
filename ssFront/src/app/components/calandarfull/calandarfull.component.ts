import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ExamService } from '../../services/serviceTeacher/exam.service';
import { CalandarService } from '../../services/serviceTeacher/calandar.service';
import { GroupService } from '../../services/servicesUtils/group.service';
import { SalleService } from '../../services/servicesUtils/salle.service';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';

export interface GroupResponse {
  groupsSubject: any[];
  groupsRank: any[];
}
@Component({
  selector: 'app-calandarfull',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
    NgbModalModule,
    CommonModule,
  ],
  templateUrl: './calandarfull.component.html',
  styleUrls: ['./calandarfull.component.css'],
})
export class CalandarfullComponent implements OnInit {
  @Input() data: any;
  @Input() groups: any;
  @Input() firstDate: any;
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

  // groupSub: any;
  // groupRank: any;
  salles: any;
  Exam: any;
  formSG: FormGroup;
  formG: FormGroup;
  formS: FormGroup;

  examType: any;
  state: boolean = false;
  MsgError: string = '';

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private examService: ExamService,
    private calandarService: CalandarService,
    private groupService: GroupService,
    private salleService: SalleService
  ) {
    this.formSG = this.fb.group({
      salleGroupList: this.fb.array([]),
    });
    this.formG = this.fb.group({
      GroupList: this.fb.array([]),
    });

    this.formS = this.fb.group({
      SalleList: this.fb.array([]),
    });

    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  statePlan() {
    this.state = !this.state;
    this.onSalleSelect();
  }

  ngOnInit(): void {
    this.inisiallLists()

    if (this.firstDate) {
      this.currentWeekStart = this.firstDate;
      this.isMonthView = false;
    }
    this.isMonthViewChange.emit(this.isMonthView);

    this.generateCalendar();
    this.generateCurrentWeek();
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
    this.fetchEvents();
    // this.fetchGroups();
    this.fetchExam();
  }
  get salleGroupList(): FormArray {
    return this.formSG.get('salleGroupList') as FormArray;
  }
  addSalleGroup(): void {
    this.salleGroupList.push(this.createSalleGroup());

    console.log('ssss list salle group ', this.salleGroupList);
  }
  removeSalleGroup(index: number): void {
    this.salleGroupList.removeAt(index);
  }

  createSalleGroup(): FormGroup {
    return this.fb.group({
      salle__id: [null, Validators.required],
      group__id: [null, Validators.required],
    });
  }
inisiallLists(){
  this.addSalleGroup();
  this.addGroup();
  this.addSalle();
}
  resetSalleGroupList(): void {
    while (this.salleGroupList.length !== 0) {
      this.salleGroupList.removeAt(0);
    }
    while (this.GroupList.length !== 0) {
      this.GroupList.removeAt(0);
    }
    while (this.SalleList.length !== 0) {
      this.SalleList.removeAt(0);
    }
  }

  get GroupList(): FormArray {
    return this.formG.get('GroupList') as FormArray;
  }
  addGroup(): void {
    this.GroupList.push(this.createGroup());

    console.log('ssss list salle group ', this.GroupList);
  }
  removeGroup(index: number): void {
    this.GroupList.removeAt(index);
  }

  createGroup(): FormGroup {
    return this.fb.group({
      group__id: [null, Validators.required],
    });
  }
  
  get SalleList(): FormArray {
    return this.formS.get('SalleList') as FormArray;
  }
  addSalle(): void {
    this.SalleList.push(this.createSalle());

    console.log('ssss list salle Salle ', this.SalleList);
  }
  removeSalle(index: number): void {
    this.SalleList.removeAt(index);
  }

  createSalle(): FormGroup {
    return this.fb.group({
      salle__id: [null, Validators.required],
    });
  }
 
  fetchExam(): void {
    console.log(
      'kjljlklsddshdshkdskldkdshkdshkldskhldshkldslkhdskldshkd',
      this.data
    );
    this.examService.getExamByid(this.data).subscribe(
      (data) => {
        this.Exam = data;

        this.examType = this.Exam.obligatoire;
        this.eventForm.patchValue({
          title: this.Exam.exam__title,
        });
        console.log('aaaaaaa2>>>>>', this.Exam);
        console.log(
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          this.Exam.exam__title
        );
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
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

  // fetchGroups(): void {
  //   this.groupService.getGroups().subscribe(
  //     (data) => {
  //       console.log('Response from backend:', data);
  //       this.groupSub = data;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching groups', error);
  //     }
  //   );
  // }

  onSalleSelect(): void {
    const startDate = this.eventForm.get('startDate')?.value;
    const startHour = this.eventForm.get('startTime')?.value;
    const endHour = this.eventForm.get('endTime')?.value;
    // const nb__place = this.eventForm.get('nb')?.value;

    const fetchSalleData = {
      starthour: new Date(`${startDate}T${startHour}`),
      endhour: new Date(`${startDate}T${endHour}`),
      exam__id: this.data,
    };
    console.log('<>><<>><><><><<>', fetchSalleData);
    this.fetchSalles(fetchSalleData);
  }

  fetchSalles(fetchSalleData: {
    starthour: Date;
    endhour: Date;
    exam__id: any;
  }): void {
    this.salleService.getSalleSpecific(fetchSalleData).subscribe(
      (data) => {
        this.salles = data;
        console.log('<>><<>><><><><<>', data);
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
    console.log('day is <<<<<<<', day);
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    console.log('selectedDate is <<<<<<<', selectedDate);
    const startOfWeek = new Date(selectedDate);

    const dayOfWeek = selectedDate.getDay();

    startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);

    this.currentWeekStart = startOfWeek;
    console.log('WeekStart is wwww', this.currentWeekStart);
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
    const starwwtOfWeek = new Date(this.firstDate);

    this.currentWeekStart = new Date(
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    );
    console.log('3currentWeekStart is <<<<<<<', this.currentWeekStart);
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
  formatDateToLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  openEventForm(kdate: Date, hour: string, modal: any): void {
    console.log(
      'kdate>>>>>>....',
      kdate
    );
    console.log(
      'hour>>>>>>....',
      hour
    );
    const formattedDate = this.formatDateToLocal(kdate);
    let formattedTime = `${hour}:00`;
    if(hour.length==4){
      formattedTime = `0${hour}:00`;
    }
   
    console.log(
      'formattedDate>>>>>>....',
      formattedTime
    );
    this.eventForm.patchValue({
      startDate: formattedDate,
      startTime: formattedTime,
      endTime: formattedTime,
      salle: '',
    });

    this.resetSalleGroupList()
    this.inisiallLists()
    this.state = false;
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
    const dateString = this.formatDateToLocal(date);
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

    const dateString = this.formatDateToLocal(date);
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
    const dateString = this.formatDateToLocal(date);
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
  formatDate(date: string, time: string): string {
    const dateTimeString = `${date}T${time}`;
    const dateTime = new Date(dateTimeString);
    console.log('ooooooooooooooooooooooo>>>', dateTime);
    return dateTime.toISOString();
  }
  saveEvent() {
    console.log(this.eventForm.value);
    if (this.eventForm.valid) {
      const formValues = this.eventForm.value;
      // For debugging purposes

      const calandarData = {
        exam__id: this.data,

        startDate: `${formValues.startDate}T${formValues.startTime}`,
        endDate: this.formatDate(formValues.startDate, formValues.endTime),

        group__name: '',
        salle: '',
        exam__title: formValues.title,
      };
      console.log(
        'beforzzzzzzzzzzzzzzzzz?????zdssssszzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzze',
        calandarData
      );

      if (this.examType) {
        if (this.state) {
          if (
            this.salleGroupList &&
            this.salleGroupList.value &&
            this.salleGroupList.value.length > 0
          ) {
            for (const row of this.salleGroupList.value) {
              if (
                row.group__id &&
                row.group__id.group__name &&
                row.salle__id &&
                row.salle__id.salle__id
              ) {
                calandarData.group__name = row.group__id.group__name;
                calandarData.salle = row.salle__id.salle__id;
                this.calandarService.createReserv(calandarData).subscribe(
                  (response: any) => {
                    alert('Successfully created');
                    console.log('success create', response);
                    this.fetchEvents();
                    const examData = {
                      exam__id: this.data,
                      operation: 1,
                      group__id: row.group__id.group__id,
                    };

                    this.examService.updateExam(examData).subscribe(
                      (response: any) => {
                        alert('Successfully updated');
                        console.log('success update', response);
                      },
                      (error: { error: { message: any } }) => {
                        console.log('error', error);
                      }
                    );
                  },
                  (error: { error: { message: any } }) => {
                    console.log('error', error);
                  }
                );
              } else {
                console.log('Invalid salleGroupList data');
              }
            }
            this.modalService.dismissAll();
          } else {
            console.log('salleGroupList is empty or invalid');
            this.MsgError = 'salleGroupList is empty or invalid';
          }
        } else {
          if (
            this.GroupList &&
            this.GroupList.value &&
            this.GroupList.value.length > 0
          ) {
            for (const row of this.GroupList.value) {
              if (row.group__id && row.group__id.group__name) {
                calandarData.group__name = row.group__id.group__name;
                this.calandarService.createReserv(calandarData).subscribe(
                  (response: any) => {
                    alert('Successfully created');
                    console.log('success create', response);
                    this.fetchEvents();
                    const examData = {
                      exam__id: this.data,
                      operation: 1,
                      group__id: row.group__id.group__id,
                    };

                    this.examService.updateExam(examData).subscribe(
                      (response: any) => {
                        alert('Successfully updated');
                        console.log('success update', response);
                      },
                      (error: { error: { message: any } }) => {
                        console.log('error', error);
                      }
                    );
                  },
                  (error: { error: { message: any } }) => {
                    console.log('error', error);
                  }
                );
              } else {
                console.log('Invalid GroupList data');
              }
            }
            this.modalService.dismissAll();
          } else {
            console.log('GroupList is empty or invalid');
            this.MsgError = 'GroupList is empty or invalid';
          }
        }
      }

      if (!this.examType) {
        if (this.state) {
          if (
            this.SalleList &&
            this.SalleList.valid &&
            this.SalleList.value.length > 0
          ) {
            for (const row of this.SalleList.value) {
              calandarData.salle = row.salle__id.salle__id;
              this.calandarService.createReserv(calandarData).subscribe(
                (response: any) => {
                  alert('Successfully create');
                  console.log('seccess create', response);
                  this.fetchEvents();
                  const examData = {
                    exam__id: this.data,
                    operation: 1,
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
            }
            this.modalService.dismissAll();
          } else {
            console.log('SalleList is empty or invalid', this.SalleList.value);
            this.MsgError = 'SalleList is empty or invalid';
          }
        } else {
          this.calandarService.createReserv(calandarData).subscribe(
            (response: any) => {
              alert('Successfully create');
              console.log('seccess create', response);
              this.fetchEvents();
              const examData = {
                exam__id: this.data,
                operation: 1,
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
          this.modalService.dismissAll();
        }
      }
      console.log('dddd te7cheee', this.examType);
    } else {
      console.log('Invalid form controls:');
      this.logInvalidControls(this.eventForm);
    }
  }
}
