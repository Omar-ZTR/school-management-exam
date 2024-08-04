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
  styles: [
    `
      :host ::ng-deep .p-paginator {
       
    justify-content: left !important;
      }
`,]
})
export class StudentanswersComponent implements OnInit {
  user__id = this.tokenService.getUserIdFromToken();
  group__id = this.tokenService.getGroupIdFromToken();
  results: any;
  group: any;
  ansStud: any[] = [];
  groupedAnsStud: { [key: string]: any[] } = {};
  groupedAnsStudArray: { subject: string, ansStudArray: any[] }[] = [];
  moyen!: { result: { [key: string]: any; }; sum: any; mean: any; };

  constructor(
    private groupService: GroupService,
    private tokenService: TokenServiceService,
    private AnswersService: ExamAnswersService
  ) {}

  ngOnInit(): void {
    this.moyen=  this.calculateResult();
    this.fetchAnswers();
    
  }

  fetchAnswers(): void {
    this.AnswersService.getStudentAnswer(this.user__id).subscribe(
      (data: any) => {
        this.results = data;
        // this.groupQuestionsByType();
        this.fetchIngroup();
        console.log('results datataken results results', this.results);
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
                  ansId:ans.ans__id,
                  date: exam.reservation?.startDate || null,
                };
                this.ansStud.push(formdata);
              }
            } else {
              const formdata = {
                subject: sub.subject__name,
                exam: exam.exam__title,
                coefficient: sub.coefficient,
                note: null,
                ansId:null,
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
          exam: null,
          coefficient: sub.coefficient,
          note: null,
          ansId:null,
          date: null,
        };
        this.ansStud.push(formdata);
      }
    }
    console.log('my formated with subjects', this.ansStud);
    this.groupBySubject()
    // Optional: Print out the formatted data for debugging
    // console.log('Formatted group data', this.group);
  }
  dateNow: Date = new Date();
  isFutureDate(examDate: Date): boolean {
    return new Date(examDate) > this.dateNow;
  }

  // Function to check if the exam date is in the past
  isPastDate(examDate: Date): boolean {
    return new Date(examDate) < this.dateNow;
  }
  groupBySubject() {
    
  
    for (const ans of this.ansStud) {
      const subject = ans.subject;
      if (!this.groupedAnsStud[subject]) {
        this.groupedAnsStud[subject] = [];
      }
      this.groupedAnsStud[subject].push(ans);
    }
  
    console.log('Grouped ansStud by subject', this.groupedAnsStud);
    this.groupedAnsStudArray = Object.keys(this.groupedAnsStud).map(subject => ({
      subject,
      ansStudArray: this.groupedAnsStud[subject]
    }));
    this.moyen=  this.calculateResult();

  console.log("moonnene",this.moyen)
  }
  calculateResult() {
    let hasNullNote = false;
    const result = this.groupedAnsStudArray.reduce((acc, group) => {
      const subjectResult = group.ansStudArray.reduce((subjectAcc, ans) => {
        if (ans.note === null) {
          hasNullNote = true;
        }

        if (ans.note !== null) {
          return subjectAcc + ans.note * ans.coefficient;
        }
        return subjectAcc;
      }, 0);

      acc[group.subject] = subjectResult;
      return acc;
    }, {} as { [key: string]: number });
    if (hasNullNote) {
      console.log('Calculated Result:', result);
      console.log('Mean (Moyen):', null);
      return { result, sum: null, mean: null };
    }

    const sum = Object.values(result).reduce((acc, value) => acc + value, 0);
    const mean = sum / Object.keys(result).length;

    console.log('Calculated Result:', result);
    console.log('Sum:', sum);
    console.log('Mean (Moyen):', mean);

    return { result, sum, mean };
  }
}
