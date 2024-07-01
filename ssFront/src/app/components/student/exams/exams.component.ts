import { Component } from '@angular/core';
import { CalandarService } from '../../../services/serviceTeacher/calandar.service';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../../services/serviceTeacher/exam.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css'
})
export class ExamsComponent {
  examlist: any;
  constructor( private calandarService: CalandarService, private examService: ExamService){}
  ngOnInit(): void {

    this.fetchExams()
    console.log("exams iss is ",this.examlist)

  }
  statutExam(id: any): void {
    this.fetchExam(id).then((exam) => {
      console.log("Exam status is", exam?.obligatoire);
      return exam?.obligatoire;
    }).catch((error) => {
      console.error('Error fetching exam status', error);
    });
  }

  async fetchExam(id: any): Promise<any> {
    try {
      const exam = await this.examService.getExamByid(id).toPromise();
      console.log('Exam data: ', exam);
      return exam;
    } catch (error) {
      console.error('Error fetching exam', error);
      throw error;
    }
  }
  fetchExams(): void {
    this.calandarService.getExams().subscribe(
      (data) => {
        this.examlist = data;
        console.log('nnddd', this.examlist);
      },
      (error) => {
        console.error('Error fetching fake questions', error);
      }
    );
  }


}
