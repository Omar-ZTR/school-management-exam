import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../services/serviceTeacher/exam.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-exams-certif',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    TooltipModule,
    TagModule,
    TriStateCheckboxModule,
    CommonModule,
  ],
  templateUrl: './exams-certif.component.html',
  styleUrl: './exams-certif.component.css',
})
export class ExamsCertifComponent implements OnInit {
  examsWithReservation: any[] = [];
  examsWithoutReservation: any[] = [];
  expandedRows: { [key: string]: boolean } = {};
  expandedRowSub: { [key: string]: boolean } = {};
  filterResult: {
    [key: number]: { title?: any; highResult?: any[]; lowResult?: any[] };
  } = {};
  acceptation: { [key: string]: { accept: any; sub__id: any } } = {};

  exams: any;
  examsView: any;
  btn: boolean = true;
  subscribes: any;
  groupedSubscriptions: { [key: string]: any[] } = {};

  getexamScheduled() {
    this.examsView = this.examsWithReservation;
    this.btn = false;
  }
  onRowExpand(event: any, index: number) {
    this.expandedRows = {}; // Reset expanded rows
    this.expandedRows[index] = true; // Expand only the selected row
    console.log('Expanded row:', event.data);
    console.log('Expanded rows state:', this.expandedRows);
  }

  onRowCollapse(event: any, index: number) {
    delete this.expandedRows[index]; // Collapse the selected row
    console.log('Collapsed row:', event.data);
    console.log('Expanded rows state:', this.expandedRows);
  }
  toggleRow(sub: any) {
    this.expandedRows[sub.exam__id] = !this.expandedRows[sub.exam__id];
  }

  toggleRowSub(sub: any) {
    this.expandedRowSub[sub] = !this.expandedRowSub[sub];
  }

  subonRowExpand(event: any, index: number) {
    this.expandedRowSub = {}; // Reset expanded rows
    this.expandedRowSub[index] = true; // Expand only the selected row
    console.log('Expanded row:', event.data);
    console.log('Expanded rows state:', this.expandedRowSub);
  }

  subonRowCollapse(event: any, index: number) {
    delete this.expandedRowSub[index]; // Collapse the selected row
    console.log('Collapsed row:', event.data);
    console.log('Expanded rows state:', this.expandedRowSub);
  }
  dateNow: Date = new Date();
  isFutureDate(examDate: Date): boolean {
    return new Date(examDate) > this.dateNow;
  }

  // Function to check if the exam date is in the past
  isPastDate(examDate: Date): boolean {
    return new Date(examDate) < this.dateNow;
  }

  constructor(private ExamService: ExamService, private messageService : MessageService) {}

  ngOnInit() {
    this.getExamCertif();
    this.getSubscribes();
  }
  groupByExamTitle(): void {
    this.groupedSubscriptions = this.subscribes.reduce(
      (
        acc: { [x: string]: any[] },
        subscription: { exams: { exam__title: any } }
      ) => {
        const examTitle = subscription.exams.exam__title;
        if (!acc[examTitle]) {
          acc[examTitle] = [];
        }
        acc[examTitle].push(subscription);
        return acc;
      },
      {} as { [key: string]: any[] }
    );

    console.log('groupedSubscriptions', this.groupedSubscriptions);
  }

  getallexam() {
    this.examsView = this.exams;
    this.btn = true;
  }
  getSubscribes() {
    this.ExamService.Subscribe().subscribe(
      (data) => {
        this.subscribes = data;
        for (const sub of this.subscribes) {
          console.log('sub', sub);

          // Ensure this.acceptation[sub.student.user__id] is initialized as an object
          if (!this.acceptation[sub.student.user__id]) {
            this.acceptation[sub.student.user__id] = {
              accept: null,
              sub__id: null,
            };
          }

          // Set properties
          this.acceptation[sub.student.user__id].accept = sub.acceptation;
          this.acceptation[sub.student.user__id].sub__id = sub.subscribe__id;

          console.log(
            'sub.student.user__id',
            this.acceptation[sub.student.user__id]
          );
        }
        console.log('subscribes is ', this.subscribes);
        this.groupByExamTitle();
      },
      (error) => {
        console.error('Error fetching exams', error);
      }
    );
  }

  getExamCertif() {
    this.ExamService.certifExam().subscribe(
      (data) => {
        console.log('certif exams is data:', data);
        this.exams = data;
        this.examsView = data;
        this.btn = true;
        // Filter exams with answers not empty
        this.examsWithReservation = data.filter(
          (exam: { reservation: string | any[] }) => exam.reservation.length > 0
        );
        console.log('Exams with reservations:', this.examsWithReservation);

        // for (const exam of this.examsWithReservation) {
        //   // Initialize the filterResult object for the exam if it doesn't exist
        //   if (!this.filterResult[exam.exam__id]) {
        //     this.filterResult[exam.exam__id] = {};
        //   }

        //   this.filterResult[exam.exam__id].highResult = exam.answers.filter(
        //     (answer: any) => answer.ans__result >= 10
        //   );

        //   this.filterResult[exam.exam__id].lowResult = exam.answers.filter(
        //     (answer: any) => answer.ans__result < 10
        //   );
        //   this.filterResult[exam.exam__id].title = exam.exam__title;
        // }

        console.log('gg', this.filterResult);

        // Filter exams with answers empty
        this.examsWithoutReservation = data.filter(
          (exam: { reservation: string | any[] }) =>
            exam.reservation.length === 0
        );
        console.log(
          'Exams without reservations:',
          this.examsWithoutReservation
        );
      },
      (error) => {
        console.error('Error fetching exams', error);
      }
    );
  }

  acceptationSub(event: any, userId: string) {
    if (this.acceptation[userId]) {
      this.acceptation[userId].accept = event.value;
    }
  }

  mapValue(value: boolean): string {
    switch (value) {
      case true:
        return 'Accepted';
      case null:
        return 'Pending';
      case false:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  getSeverity(value: boolean): string {
    switch (value) {
      case true:
        return 'success';
      case null:
        return 'warning';
      case false:
        return 'danger';
      default:
        return 'info';
    }
  }

  updateAcceptation(sub: any, data:any) {

  

    const i= this.groupedSubscriptions[data.exams.exam__title].indexOf(data)

    this.ExamService.updateSubscribe(sub).subscribe(
      (response) => {
       
        if(sub.accept == true){
 this.messageService.add({ severity: 'success', summary: '', detail:  'accepted' });
        }
        if(sub.accept == false){
          this.messageService.add({ severity: 'success', summary: '', detail:  'Rejected' });
        }
        if(sub.accept == null){
          this.messageService.add({ severity: 'success', summary: '', detail:  'Pending' });
        }

        console.log('seccess', response);
        this.groupedSubscriptions[data.exams.exam__title][i]=response
      },
      (error) => {
        console.error('Error fetching exams', error);
        if(error.error?.message){
         
          this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
          }
      }
    );



  }
}
