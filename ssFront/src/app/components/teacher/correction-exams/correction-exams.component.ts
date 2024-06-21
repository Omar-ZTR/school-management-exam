import { Component } from '@angular/core';
import { ExamAnswersService } from '../../../services/serviceAnswers/exam-answers.service';
// import { HttpClientModule } from '@angular/common/http'; HttpClientModule,
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ExamService } from '../../../services/serviceTeacher/exam.service';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';

@Component({
  selector: 'app-correction-exams',
  standalone: true,
  imports: [
    CommonModule,
    FieldsetModule,
    PanelModule,
    DialogModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TagModule,
    InputNumberModule,
    ImageModule,
    FormsModule,
  ],
  templateUrl: './correction-exams.component.html',
  styleUrl: './correction-exams.component.css',
  styles: [
    `
      :host ::ng-deep .p-dialog-footer {
        background: #e0e0e0 !important;
      }

      :host ::ng-deep .p-panel-content {
        border-color: var(--teal-500);
      }
    `,
  ],
})
export class CorrectionExamsComponent {
  [x: string]: any;
  total!: number;
  result!:number;
  examType!:string;
  Answers: any;
  groupedQuestions: { [key: string]: any[] } = {};
  visible: boolean = false;
  Exam: any;
  studentAnswer: any;
  questionNotes: { idQ: number; value: number; noteQ: number }[] = [];

  showDialog(dataAnswer: any) {
    this.visible = true;
    this.studentAnswer = dataAnswer;
    console.log('hddhdhdhdhdhdh', dataAnswer);
    if (!this.Exam) {
      this.fetchExam(dataAnswer.exam__id);
    } else if (this.Exam.exam__id != dataAnswer.exam__id) {
      this.fetchExam(dataAnswer.exam__id);
    }
  }
  valNote(id:number) :number{
    const existingNote = this.questionNotes.find(
      (note) => note.idQ === id
    );
    if(existingNote){
      return existingNote.value
    }
    return 0
  }

  typeFile(file: any):any {
  
        const extension = getFileExtension(file.file__name);
        const fileType = getFileType(extension);
// console.log("type file is",fileType)
// console.log("type  is",file.file__type)
        return { name: file.name, type: fileType }
      }
 
  constructor(
    private AnswerService: ExamAnswersService,
    private examService: ExamService
  ) {}
  ngOnInit(): void {
    this.fetchAnswers();
  }

  fetchAnswers(): void {
    this.AnswerService.getAnswer().subscribe(
      (data) => {
        this.Answers = data;
        // this.groupQuestionsByType();
        console.log('datataken', this.Answers);
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }
  getAnswer(question: any): string {
    for (let ans of this.studentAnswer.answers) {
      // console.log("ooooo",ans.Answer__text)
      // console.log("quest", reponse )
      if (
        ans.question__id === question.question__id &&
        ans.Answer__text != null
      ) {
        return ans.Answer__text;
      }
    }
    return 'No Answer';
  }

  checkAnswer(question: any, reponse: any) {
    let styles = {
      color: 'black',
    };
    let iconClass = 'fa-solid fa-window-minimize';
    // console.log("gggggg",question)
    // console.log("kkkkk",this.studentAnswer)
    for (let ans of this.studentAnswer.answers) {
      // console.log("ooooo",ans.Answer__text)
      // console.log("quest", reponse )
      if (
        ans.question__id === question.question__id &&
        ans.Answer__text === reponse.reponse__text
      ) {
        styles = {
          color: 'red',
        };

        iconClass = 'fa-solid fa-times';
        console.log(ans.Answer__text, 'falsetrue', reponse.reponse__text);
        if (reponse.reponse__statut === true) {
          styles = {
            color: 'green',
          };
          iconClass = 'fa-solid fa-check';
          console.log(ans.Answer__text, 'ssss', 'ss', reponse);
        }
      }
    }
    return { styles, iconClass };
  }
  fetchExam(id: any): void {
    this.examService.getExamByid(id).subscribe(
      (data) => {
        this.Exam = data;
        this.groupQuestionsByType();
        console.log('datataken', this.Exam);
        this.examType = this.Exam.exam__type
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }
  groupQuestionsByType(): void {
    if (this.Exam && this.Exam.questions) {
      this.Exam.questions.forEach((question: any) => {
        const questionType = question.question__type;
        if (!this.groupedQuestions[questionType]) {
          this.groupedQuestions[questionType] = [];
        }
        this.groupedQuestions[questionType].push(question);
      });
    }
    console.log(this.groupedQuestions);
  }

  getQuestion(id: number): string {
    for (const question of this.Exam.questions) {
      if (id === question.question__id) {
        return question.question__text;
      }
    }
    return '';
  }

  getQuestionTypes(): string[] {
    return Object.keys(this.groupedQuestions);
  }

  onInput(event: any, question: any): any {
    let value = Number(event.target.value);
    const max = question.note != null ? question.note : 20;

    if (value < 0) {
      value = 0;
    } else if (value > max) {
      value = max;
    }

    return value;
  }

  NoteQuestion(numericValue: number, question: any) {
    // Find if the question already has a note
    const existingNote = this.questionNotes.find(
      (note) => note.idQ === question.question__id
    );
    const noteQ = question.note;
    const idQ = question.question__id;
    let value = Number(numericValue);
    const max = question.note != null ? question.note : 20;

    // Enforce min and max constraints
    if (value < 0) {
      value = 0;
    } else if (value > max) {
      value = max;
    }
    if (existingNote) {
      // Update the existing note value
      existingNote.value = value;
    } else {
      // Add a new note object to the array
      this.questionNotes.push({ idQ, value, noteQ });
    }

    console.log(
      'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
      this.questionNotes
    ); 
    this.total = 0 // Log the array to check
  }
  get totalNote(): number {
    return this.questionNotes.reduce((total, note) => total + note.value, 0);
  }




  onTotalNoteChange(value: number): void {
    this.total = value;
  }

  submitResult(): void {
    console.log("totalNote is : ", this.totalNote)
    console.log("ttt is : ", this.total)

    if ((this.total === 0 ||this.total == undefined) && this.totalNote === 0) {
      this.result = 0;
    } else if (this.total === 0 && this.totalNote !== 0) {
      this.result = this.totalNote;
    } else if (this.total !== 0) {
      this.result = this.total;
    }
    console.log("rerererre is : ", this.result)
  }
}
