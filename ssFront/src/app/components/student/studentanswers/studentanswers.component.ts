import { Component, OnInit } from '@angular/core';
import { ExamAnswersService } from '../../../services/serviceAnswers/exam-answers.service';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { GroupService } from '../../../services/servicesUtils/group.service';

@Component({
  selector: 'app-studentanswers',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './studentanswers.component.html',
  styleUrl: './studentanswers.component.css',
})
export class StudentanswersComponent implements OnInit {
  user__id = this.tokenService.getUserIdFromToken();
  group__id = this.tokenService.getGroupIdFromToken();
  results: any;
  group: any;
  ansStud: any[] = [];
  constructor(
    private groupService: GroupService,
    private tokenService: TokenServiceService,
    private AnswersService: ExamAnswersService
  ) {}

  ngOnInit(): void {
    this.fetchAnswers();
  }

  fetchAnswers(): void {
    this.AnswersService.getStudentAnswer(this.user__id).subscribe(
      (data: any) => {
        this.results = data;
        // this.groupQuestionsByType();
        this.fetchIngroup();
        console.log('datataken', this.results);
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }

  fetchIngroup(): void {
    this.groupService.getoneGroup(this.group__id).subscribe(
      (data: any) => {
        this.group = data;
        // this.groupQuestionsByType();
        console.log('group', this.group);

        this.formateData();
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }
  rowSpans: { [key: string]: number } = {};
   calculateRowSpans() {
    this.rowSpans = this.ansStud.reduce((acc: { [x: string]: any; }, result: { subject: string | number; }) => {
      acc[result.subject] = (acc[result.subject] || 0) + 1;
      return acc;
    }, {});
  }
  formateData(): void {
    // Add a property 'answers' to each exam in the group to hold the related answers
    for (const exam of this.group.exams) {
      exam.answers = this.results.filter(
        (answer: { exam__id: any; exam__oblig: boolean }) =>
          answer.exam__id === exam.exam__id && answer.exam__oblig === true
      );
    }

    for (const sub of this.group.subjects) {
      let count = 0;
      let i = -1;
      if (this.group.exams.length > 0) {
        for (const exam of this.group.exams) {
          i = i + 1;
          if (exam.subject === sub.subject__name) {
            count = count + 1;
            if (exam.answers.length > 0) {
              for (const ans of exam.answers) {
                const formdata = {
                  subject: sub.subject__name,
                  exam: exam.exam__title,
                  coefficient: sub.coefficient,
                  note: ans.ans__result,
                  date: exam.reservation?.startDate || null,
                };
                this.ansStud.push(formdata);
              }
            } else {
              const formdata = {
                subject: sub.subject__name,
                exam: exam.exam__title,
                coefficient: sub.coefficient,
                note: '',
                date: exam.reservation?.startDate || null,
              };
              this.ansStud.push(formdata);
            }
          }
        }
      }
      if (count == 0) {
        const formdata = {
          subject: sub.subject__name,
          exam: '',
          coefficient: sub.coefficient,
          note: '',
          date: '',
        };
        this.ansStud.push(formdata);
      }
    }
    console.log('my formated with subjects', this.ansStud);
    this.calculateRowSpans()
    // Optional: Print out the formatted data for debugging
    // console.log('Formatted group data', this.group);
  }
}
