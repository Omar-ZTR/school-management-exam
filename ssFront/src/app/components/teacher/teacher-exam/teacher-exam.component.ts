import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { ExamService } from '../../../services/serviceTeacher/exam.service';
import { MenuItem } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';
import { RouterModule, RouterOutlet } from '@angular/router';
export interface Exam {
  subject: string;
  exam__type: string;
  // Add other properties if needed
}


@Component({
  selector: 'app-teacher-exam',
  standalone: true,
  imports: [TableModule, CommonModule,SpeedDialModule, ButtonModule, HttpClientModule,RouterOutlet,RouterModule,],
  templateUrl: './teacher-exam.component.html',
  styleUrl: './teacher-exam.component.css'
})
export class TeacherExamComponent {
  Exams: Exam[] = [];
  items: MenuItem[] | null = null;
  first = 0;

  rows = 10;

  constructor(private examService: ExamService) {}

  ngOnInit() {
    this.items = [
      {
          icon: 'pi pi-pencil',
          command: () => {
             console.log("helooo")}
      },
      {
          icon: 'pi pi-refresh',
          command: () => {
             console.log("helooo")}
      },
   
      {
          icon: 'pi pi-upload',
          routerLink: ['/fileupload']
      },
      // {
      //     icon: 'pi pi-external-link',
      //     target: '_blank',
      //     url: 'http://angular.io'
      // }
  ];
      this.fetchGroups()
      console.log("><><><><><><><><><><><", this.Exams)
  }
  fetchGroups(): void {
    this.examService.getTeacherExam().subscribe(
      (data: Exam[]) => {
        console.log('Response from backend:', data);
        this.Exams = data;
      },
      (error: any) => {
        console.error('Error fetching groups', error);
      }
    );
  }
  next() {
      this.first = this.first + this.rows;
  }

  prev() {
      this.first = this.first - this.rows;
  }

  reset() {
      this.first = 0;
  }

  pageChange(event: { first: number; rows: number; }) {
      this.first = event.first;
      this.rows = event.rows;
  }

  isLastPage(): boolean {
      return this.Exams ? this.first === this.Exams.length - this.rows : true;
  }

  isFirstPage(): boolean {
      return this.Exams ? this.first === 0 : true;
  }
}
