import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  output,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ExamService } from '../../services/serviceTeacher/exam.service';
import { CalandarService } from '../../services/serviceTeacher/calandar.service';
import { GroupService } from '../../services/servicesUtils/group.service';
import { SalleService } from '../../services/servicesUtils/salle.service';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';

export interface GroupResponse {
  groupsSubject: any[];
  groupsRank: any[];
}
@Component({
  selector: 'app-calandarfull',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
    NgbModalModule,
    CommonModule,
    CalendarModule,
  ],
  templateUrl: './calandarfull.component.html',
  styleUrls: ['./calandarfull.component.css'],
})
export class CalandarfullComponent implements OnInit {
  @Input() data: any;
  @Input() groups: any;
  @Input() firstDate: any;
  @Output() isMonthViewChange = new EventEmitter<boolean>();
  @Output() isAddPlan = new EventEmitter<any>();

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
  salles: any = [];
  Exam: any;
  formSG: FormGroup;
  formG: FormGroup;
  formS: FormGroup;

  examType: any;
  state: boolean = false;
  MsgError: string = '';
  daysMonth!: string[];
  salle: any;
  ErrValid: string = '';
  examId: any;

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
      endTime: [
        '',
        Validators.required,
        endTimeValidator('startTime', 'endTime'),
      ],
    });
  }
  checkGroups() {
    let Allgroups = this.groups;

    for (const e of this.examlist) {
 
      for (const g of this.groups) {
        if (e.group__name === g.group__name && e.exam__id == this.examId) {
  
          Allgroups = this.groups.filter(
            (G: { group__id: any }) => G.group__id !== g.group__id
          );
          console.log('e.group__name  e.group__name ', e.group__name);
          console.log('g.group__name g.group__name', g.group__name);
          console.log('e.exam__id e.exam__id', e.exam__id);
          console.log('g.group__id g.group__id', this.examId);
        }
      }
    }
    this.groups = Allgroups;
  }
  statePlan() {
    this.state = !this.state;
    this.onSalleSelect();
    this.resetSalleGroupList();
    this.inisiallLists();
  }
  inisiallLists() {
    this.salleGroupList.push(this.createSalleGroup());
    this.GroupList.push(this.createGroup());
    this.SalleList.push(this.createSalle());
  }
  ngOnInit(): void {
    this.inisiallLists();
    this.fetchExam();
    if (this.firstDate) {
      this.currentWeekStart = this.firstDate;
      this.isMonthView = false;
    }
    this.isMonthViewChange.emit(this.isMonthView);

    this.generateCalendar();
    this.generateCurrentWeek();
    this.eventForm = this.fb.group({
      title: [''],
      startDate: [''],
      startTime: [''],
      endTime: [''],
    });
     
    this.fetchEvents();
    // this.fetchGroups();
   
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
    this.IDs = [];
    this.IDg = [];
    this.GIDsg = [];
    this.SIDsg = [];
    this.salles.forEach((item: { disabled: boolean }) => {
      item.disabled = false;
    });
    this.groups.forEach((item: { disabled: boolean }) => {
      item.disabled = false;
    });
  }

  // for Salle and group

  checkListSG(): boolean {
    let ok = true;
    const i = this.salleGroupList.value.length;
    const S = this.salles.length;
    const G = this.groups.length;
    if (S == i || G == i) {
      ok = false;
    }

    return ok;
  }

  get salleGroupList(): FormArray {
    return this.formSG.get('salleGroupList') as FormArray;
  }
  addSalleGroup(): void {
    const i = this.salleGroupList.value.length;
    if (
      this.salleGroupList.value[i - 1].group__id !== null &&
      this.salleGroupList.value[i - 1].salle__id !== null
    ) {
      this.salleGroupList.push(this.createSalleGroup());
      this.AvailableSalles();
      this.AvailableGroups();
      this.ErrValid = '';
    } else {
      this.ErrValid = 'fill all the field';
      console.log(
        'The last item has a Group__id of null, so no action is taken.'
      );
    }
    console.log('ssss list salle group ', this.salleGroupList);
  }

  GIDsg: any = [];
  AvailableGroups(): void {
    const selectedSalleIds = this.salleGroupList.controls
      .map((control) => control.value.group__id)
      .filter((id: any) => id != null);

   
    if (selectedSalleIds.length > 0) {
      for (const SID of selectedSalleIds) {
        if (!this.GIDsg.includes(SID.group__id)) {
          this.GIDsg.push(SID.group__id);
        }
      }
      this.groups.forEach((item: { disabled: boolean; group__id: any }) => {
        item.disabled = this.GIDsg.includes(item.group__id);
      });
    }
  
  }

  SIDsg: any = [];
  AvailableSalles(): void {
    const selectedSalleIds = this.salleGroupList.controls
      .map((control) => control.value.salle__id)
      .filter((id: any) => id != null);


    if (selectedSalleIds.length > 0) {
      for (const SID of selectedSalleIds) {
        if (!this.SIDsg.includes(SID.salle__id)) {
          this.SIDsg.push(SID.salle__id);
        }
      }
      this.salles.forEach((item: { disabled: boolean; salle__id: any }) => {
        item.disabled = this.SIDsg.includes(item.salle__id);
      });
    }

  }

  removeSalleGroup(index: number): void {
    if (
      this.salleGroupList.value[index] &&
      this.salleGroupList.value[index].salle__id
    ) {
      const idToRemove = this.salleGroupList.value[index].salle__id.salle__id;
      this.SIDsg = this.SIDsg.filter((id: any) => id !== idToRemove);
      this.salles.forEach((item: { disabled: boolean; salle__id: any }) => {
        item.disabled = this.SIDsg.includes(item.salle__id);
      });
    }

    if (
      this.salleGroupList.value[index] &&
      this.salleGroupList.value[index].group__id
    ) {
      const idToRemove = this.salleGroupList.value[index].group__id.group__id;
      this.GIDsg = this.GIDsg.filter((id: any) => id !== idToRemove);
      this.groups.forEach((item: { disabled: boolean; group__id: any }) => {
        item.disabled = this.GIDsg.includes(item.group__id);
      });
    }

    this.salleGroupList.removeAt(index);
  }

  createSalleGroup(): FormGroup {
    return this.fb.group({
      salle__id: [null, Validators.required],
      group__id: [null, Validators.required],
    });
  }

  // for group

  checkListG(): boolean {
    let ok = true;
    const i = this.GroupList.value.length;
    const G = this.groups.length;

    if (G == i) {
      ok = false;
    }

    return ok;
  }
  get GroupList(): FormArray {
    return this.formG.get('GroupList') as FormArray;
  }
  addGroup(): void {
    const i = this.GroupList.value.length;
    if (this.GroupList.value[i - 1].group__id !== null) {
      this.GroupList.push(this.createGroup());
      this.updateAvailableGroups();
      this.ErrValid = '';
    } else {
      this.ErrValid = 'select Group';
      console.log(
        'The last item has a Group__id of null, so no action is taken.'
      );
    }
    console.log('ssss list salle group ', this.GroupList);
  }

  IDg: any = [];
  updateAvailableGroups(): void {
    const selectedgroupIds = this.GroupList.controls
      .map((control) => control.value.group__id)
      .filter((id: any) => id != null);


    if (selectedgroupIds.length > 0) {
      for (const SID of selectedgroupIds) {
        if (!this.IDg.includes(SID.group__id)) {
          this.IDg.push(SID.group__id);
        }
      }
      this.groups.forEach((item: { disabled: boolean; group__id: any }) => {
        item.disabled = this.IDg.includes(item.group__id);
      });
    }
 
  }

  removeGroup(index: number): void {
    if (this.GroupList.value[index] && this.GroupList.value[index].group__id) {
      const idToRemove = this.GroupList.value[index].group__id.group__id;
      this.IDg = this.IDg.filter((id: any) => id !== idToRemove);
      this.groups.forEach((item: { disabled: boolean; group__id: any }) => {
        item.disabled = this.IDg.includes(item.group__id);
      });
    }
    this.GroupList.removeAt(index);
  }

  createGroup(): FormGroup {
    return this.fb.group({
      group__id: [null, Validators.required],
    });
  }

  // for Salle

  checkList(): boolean {
    let ok = true;
    const i = this.SalleList.value.length;
    const S = this.salles.length;

    if (S == i) {
      ok = false;
    }

    return ok;
  }
  get SalleList(): FormArray {
    return this.formS.get('SalleList') as FormArray;
  }
  addSalle(): void {
    console.log('SalleList1 salle Salle ', this.SalleList);
    console.log('Salles1 salle Salle ', this.SalleList.value.length);
    const i = this.SalleList.value.length;
    if (this.SalleList.value[i - 1].salle__id !== null) {
      this.SalleList.push(this.createSalle());
      this.updateAvailableSalles();
      this.ErrValid = '';
    } else {
      this.ErrValid = 'select Salle';
      console.log(
        'The last item has a salle__id of null, so no action is taken.'
      );
    }
  }
  IDs: any = [];
  updateAvailableSalles(): void {
    const selectedSalleIds = this.SalleList.controls
      .map((control) => control.value.salle__id)
      .filter((id: any) => id != null);

    console.log('dddd', selectedSalleIds);
    if (selectedSalleIds.length > 0) {
      for (const SID of selectedSalleIds) {
        if (!this.IDs.includes(SID.salle__id)) {
          this.IDs.push(SID.salle__id);
        }
      }
      this.salles.forEach((item: { disabled: boolean; salle__id: any }) => {
        item.disabled = this.IDs.includes(item.salle__id);
      });
    }
    console.log('sasaasll  IDS', this.IDs);
    console.log('salles  salles salles salles', this.salles);
  }

  removeSalle(index: number): void {
    if (this.SalleList.value[index] && this.SalleList.value[index].salle__id) {
      const idToRemove = this.SalleList.value[index].salle__id.salle__id;
      this.IDs = this.IDs.filter((id: any) => id !== idToRemove);
      this.salles.forEach((item: { disabled: boolean; salle__id: any }) => {
        item.disabled = this.IDs.includes(item.salle__id);
      });
    }
    this.SalleList.removeAt(index);
    // Remove the ID from the IDs array
  }

  createSalle(): FormGroup {
    return this.fb.group({
      salle__id: [null, Validators.required],
    });
  }

  fetchExam(): void {
    console.log(
      'xxx',
      this.data
    );
    this.examService.getExamByid(this.data).subscribe(
      (data) => {
        this.Exam = data;
        this.examId = this.Exam.exam__id;
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
    console.log("gg event")
    this.calandarService.getEvents().subscribe(
      (data) => {
        this.examlist = data;
        this.checkGroups();
        console.log("ffdffddfd")
       
      },
      (error) => {
        console.error('Error fetching fake questions', error);
      }
    );
  }

  onSalleSelect(): void {
    const startDate = this.eventForm.get('startDate')?.value;
    const startHour = this.eventForm.get('startTime')?.value;
    const endHour = this.eventForm.get('endTime')?.value;

    const fetchSalleData = {
      starthour: new Date(`${startDate}T${startHour}`),
      endhour: new Date(`${startDate}T${endHour}`),
      reserv__id: -1,
    };
   
    this.fetchSalles(fetchSalleData);
  }

  fetchSalles(fetchSalleData: {
    starthour: Date;
    endhour: Date;
    reserv__id: any;
  }): void {
    this.salleService.getSalleSpecific(fetchSalleData).subscribe(
      (data) => {
        this.salles = data;
   
      },
      (error) => {
        console.error('Error fetching salles', error);
      }
    );
  }

  extractDayNumber(dayString: string): number {
    const match = dayString.match(/\d+/);
    return match ? parseInt(match[0], 10) : NaN;
  }

  openWeekView(dayString: string) {
    const day = this.extractDayNumber(dayString);
 
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
    const starwwtOfWeek = new Date(this.firstDate);

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

    this.daysMonth = Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = new Date(this.currentYear, this.currentMonth, i + 1);
      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
      return `${dayName} ${i + 1}`;
    });

    // Define the type for the keys of dayOffsets
    type DayName = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

    // Define the dayOffsets object
    const dayOffsets: { [key in DayName]: number } = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    // Determine the number of leading empty strings based on the first day of the month
    const firstDayName = this.daysMonth[0].split(' ')[0] as DayName;
    const offset = dayOffsets[firstDayName] || 0;

    // Prepend empty strings to the beginning of the daysMonth array
    for (let i = 0; i < offset; i++) {
      this.daysMonth.unshift(' ');
    }
  }

  genersateCalendar() {
    const date = new Date(this.currentYear, this.currentMonth, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    this.monthName = `${monthName} ${this.currentYear}`;
    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();

    this.daysMonth = Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = new Date(this.currentYear, this.currentMonth, i + 1);
      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
      return `${dayName} ${i + 1}`;
    });
  }

  formatDateToLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  formatDateLocal(Y: number, M: number, d: number) {
    const year = String(Y);
    const month = String(M + 1).padStart(2, '0'); // Ensure month is zero-padded
    const day = String(d).padStart(2, '0'); // Ensure day is zero-padded

    return `${year}-${month}-${day}`;
  }
  openEventForm(kdate: Date, hour: string, modal: any): void {


    const formattedDate = this.formatDateToLocal(kdate);
    let formattedTime = `${hour}:00`;
    if (hour.length == 4) {
      formattedTime = `0${hour}:00`;
    }

  
    this.eventForm.patchValue({
      startDate: formattedDate,
      startTime: formattedTime,
      endTime: formattedTime,
      salle: '',
    });
    this.checkGroups()
    this.resetSalleGroupList();
    this.inisiallLists();
    this.state = false;
    this.modalService.open(modal, { centered: true });
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
      const date = this.formatDateLocal(
        this.currentYear,
        this.currentMonth,
        day
      );
      // new Date(this.currentYear, this.currentMonth, day)
      // .toISOString()
      // .split('T')[0];

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
    const colors = ['#ff00e8', '#00ff56', '#f44336', '#19287b', '#feac32'];

    const defaultColor = '#feac32'; // Default color if only one event on the same day

    let styles = {
      width: '10%',
      height: 'auto',
      transform: `translateY(0px)`,
      'box-shadow': `0 4px 30px ${defaultColor}`,
      'z-index': '99',
      'background-color': `${defaultColor}c2`,
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
            colorIndex !== -1 ? `${colors[colorIndex]}c2` : `${defaultColor}c2`,
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
 
    return dateTime.toISOString();
  }
  saveEvent() {
 
    this.controlTime();
    if (this.eventForm.valid) {
      const formValues = this.eventForm.value;
      // For debugging purposes

     

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
                // calandarData.group__name = row.group__id.group__name;
                // calandarData.salle = row.salle__id.salle__id;


                const calandarData = {
                  exam__id: this.data,
          
                  startDate: `${formValues.startDate}T${formValues.startTime}`,
                  endDate: this.formatDate(formValues.startDate, formValues.endTime),
                  group__name :row.group__id.group__name,
                  salle : row.salle__id.salle__id,
                  exam__title: formValues.title,
                };


                this.calandarService.createReserv(calandarData).subscribe(
                  (response: any) => {
                    this.isAddPlan.emit(response);
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
                        this.modalService.dismissAll();
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
                this.MsgError = 'salle/Group is empty';
              }
            }
          } else {
            console.log('salleGroupList is empty or invalid');
            this.MsgError = 'salle/Group is empty';
          }
        } else {
          if (
            this.GroupList &&
            this.GroupList.value &&
            this.GroupList.value.length > 0
          ) {
            for (const row of this.GroupList.value) {
              if (row.group__id && row.group__id.group__name) {

                const calandarData = {
                  exam__id: this.data,
          
                  startDate: `${formValues.startDate}T${formValues.startTime}`,
                  endDate: this.formatDate(formValues.startDate, formValues.endTime),
                  group__name :row.group__id.group__name,
               
                  exam__title: formValues.title,
                };


                calandarData.group__name = row.group__id.group__name;
                this.calandarService.createReserv(calandarData).subscribe(
                  (response: any) => {
                    this.isAddPlan.emit(response);
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
                        this.modalService.dismissAll();
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
                this.MsgError = 'Group is empty ';
              }
            }
          } else {
            console.log('GroupList is empty or invalid');
            this.MsgError = 'Group is empty ';
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

              const calandarData = {
                exam__id: this.data,
        
                startDate: `${formValues.startDate}T${formValues.startTime}`,
                endDate: this.formatDate(formValues.startDate, formValues.endTime),
            
                salle : row.salle__id.salle__id,
                exam__title: formValues.title,
              };

              
              // calandarData.salle = row.salle__id.salle__id;
              this.calandarService.createReserv(calandarData).subscribe(
                (response: any) => {
                  this.isAddPlan.emit(response);
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
                      this.modalService.dismissAll();
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
          } else {
            console.log('SalleList is empty or invalid', this.SalleList.value);
            this.MsgError = 'Salle is empty ';
          }
        } else {

          const calandarData = {
            exam__id: this.data,
    
            startDate: `${formValues.startDate}T${formValues.startTime}`,
            endDate: this.formatDate(formValues.startDate, formValues.endTime),
    
         
            exam__title: formValues.title,
          };
          console.log(
            'beforzzzzzzzzzzzzzzzzz?????zdssssszzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzze',
            calandarData
          );

          this.calandarService.createReserv(calandarData).subscribe(
            (response: any) => {
              this.isAddPlan.emit(response);

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
                  this.modalService.dismissAll();
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
      }
      console.log('dddd te7cheee', this.examType);
    } else {
      console.log('Invalid form controls:');
      this.logInvalidControls(this.eventForm);
    }
  }

  controlTime(): void {
    const start = this.eventForm.get('startTime')?.value;
    let end = this.eventForm.get('endTime')?.value;

    if (!start || !end) {
      console.log('Start time or End time is not set');
      return;
    }

    // Parse start time and add 15 minutes
    const [startHours, startMinutes] = start.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes + 15, 0, 0);

    // Parse end time
    const [endHours, endMinutes] = end.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);

    console.log('Start time + 15 minutes:', startDate);
    console.log('End time:', endDate);

    if (startDate < endDate) {
      console.log('End time is valid.');
    } else {
      console.log(
        'End time must be at least 15 minutes after start time.',
        this.eventForm.controls['endTime']
      );
      this.eventForm.get('endTime')?.setErrors({
        endTimeInvalid:
          'The end time must be at least 15 minutes greater than the start time',
      });
    }
  }
}

export function endTimeValidator(
  startControlName: string,
  endControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const startTime = formGroup.get(startControlName)?.value;
    const endTime = formGroup.get(endControlName)?.value;

    if (!startTime || !endTime) {
      return null; // return if either time is not set
    }

    return endTime > startTime
      ? null
      : { endTimeInvalid: 'End time must be greater than start time' };
  };
}
