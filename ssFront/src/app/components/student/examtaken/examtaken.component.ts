import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ExamService } from '../../../services/serviceTeacher/exam.service';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';



import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ExamAnswersService } from '../../../services/serviceAnswers/exam-answers.service';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-examtaken',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    CheckboxModule,
    FieldsetModule,
    RadioButtonModule,
    PanelModule,
    CommonModule,
    ReactiveFormsModule,

    ImageModule,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './examtaken.component.html', 
  styleUrls: ['./examtaken.component.css']
})
export class ExamtakenComponent {
  listFile: any = {};
  urls: any[] = [];
  descreption='';
  activeIndex: number = 0;
  displayCustom!: boolean ;
  exam__id = 15;
  Exam: any;
  groupedQuestions: { [key: string]: any[] } = {};
  AnswersForm: FormGroup;
  user__id = this.tokenService.getUserIdFromToken();
  examType!:string;
  visible: boolean = false;

  showDialog() {
    this.visible = true;
    this.checkAnswers()
  }
  allAnswersEmpty(): boolean {
    return this.answers.controls.every(control => !control.value.Answer__text);
  }
  constructor(
    private examService: ExamService, 
    private examAnswers: ExamAnswersService, 
    private fb: FormBuilder,  
    private tokenService: TokenServiceService
  ) {
    this.AnswersForm = this.fb.group({
      exam__id: this.exam__id,
      Student__id: this.user__id,
      answers: this.fb.array([]),
      ans__description:''
    });
  }

  ngOnInit(): void {
    this.fetchExam();
    this.startTimer();

  }
  description(value: string): void {
    this.AnswersForm.patchValue({
      ans__description: value
    });

  }
  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }
  async detectFiles(event: any) {
    let files = event.target.files;
    this.listFile = [];
    this.urls = [];

    if (files) {
      for (let file of files) {
        this.listFile.push(file);
        const extension = getFileExtension(file.name);
        const fileType = getFileType(extension);

        await this.readFileAsync(file).then((url: any) => {
          this.urls.push({ name: file.name, type: fileType, url: url });
        });
      }
    }
  }
 
  readFileAsync(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number) {
    this.listFile.splice(index, 1);
    this.urls.splice(index, 1);
  }
  fetchExam(): void {
    this.examService.getExamByid(this.exam__id).subscribe(
      (data) => {
        this.Exam = data;
        this.groupQuestionsByType();
        this.examType= this.Exam.exam__type;
        console.log("datataken", this.Exam);
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }
  getAnswersByQuestionId(questionId: number): any[] {
    return this.answers.controls.filter((control) => control.value.question__id === questionId);
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
  }

  getQuestion(id: number): string {
    
      for (const question of this.Exam.questions) {
        if (id === question.question__id) {
          return question.question__text;
        }
      
    }
    return '';
  }
  typeFile(file: any):any {
  
    const extension = getFileExtension(file.file__name);
    const fileType = getFileType(extension);
// console.log("type file is",fileType)
// console.log("type  is",file.file__type)
    return { name: file.name, type: fileType }
  }
  getQuestionTypes(): string[] {
    return Object.keys(this.groupedQuestions);
  }

  timeExam: number = 2 * 60 * 60; // 2 hours in seconds
  interval: any;

  ngOnDestroy() {
    this.clearTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeExam > 0) {
        this.timeExam--;
      } else {
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  get formattedTime(): string {
    const hours = Math.floor(this.timeExam / 3600);
    const minutes = Math.floor((this.timeExam % 3600) / 60);
    const seconds = this.timeExam % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  // onCheckboxChange(event: any, question: any, reponse: any): void {
  //   const index = this.answers.controls.findIndex((x) => x.value.answer__id === reponse.reponse__id);
  
  //   if (index === -1) {
  //     // If the answer is not in the array, add it
  //     this.answers.push(this.fb.group({
  //       question__id: question.question__id,
  //       anser__id: reponse.reponse__id,
  //       Answer__text: reponse.reponse__text
  //     }));
  //   } else {
  //     // If the answer is already in the array, remove it
  //     this.answers.removeAt(index);
  //   }
  // }
  onCheckboxChange(event: any, question: any  , reponse: any): void {
    const existingAnswerIndex = this.answers.controls.findIndex((answer: any) => 
      answer.value.question__id === question.question__id &&
      answer.value.anser__id === reponse.reponse__id
    );
  console.log(question.question__id)
    if (existingAnswerIndex !== -1) {
      // Remove the existing answer
      this.answers.removeAt(existingAnswerIndex);
    } else {
      // Add the new answer
      this.answers.push(this.fb.group({

        question__id: question.question__id,
        anser__id: reponse.reponse__id,
        Answer__text: reponse.reponse__text
      }));
    }
  }

  answer(value: string, questionId: number) {
    const existingAnswerIndex = this.answers.controls.findIndex((answer: any) => 
      answer.value.question__id === questionId 
    );
  
    if (existingAnswerIndex !== -1) {
      // Remove the existing answer
      this.answers.removeAt(existingAnswerIndex);
    } 
      // Add the new answer
      this.answers.push(this.fb.group({

        question__id: questionId,
        anser__id:'',
        Answer__text:value
      }));
   
  }

  get answers(): FormArray {
    return this.AnswersForm.get('answers') as FormArray;
  }
  openFile(filePath: string): void {
    window.open(filePath, '_blank');
  }

  downloadFile(file__name: any): void {
    this.examAnswers.downloadFile(file__name).subscribe((blob: Blob) => {
      saveAs(blob,file__name);
          
        }, error => {
          console.error('Error downloading file:', error);
          // Handle any errors here
        });
  }


  downloadAllFiles(): void {
    const delay = 500; // Delay in milliseconds

    this.Exam.fileExam.forEach((file: { file__path: string; file__name: string; }, index: number) => {
      console.log("this in ts file",file.file__name)
      this.examAnswers.downloadFile(file.file__name).subscribe((blob: Blob) => {
    saveAs(blob, file.file__name);
        
      }, error => {
        console.error('Error downloading file:', error);
        // Handle any errors here
      });
    });
  }
  checkAnswers():void{
    const questions = this.Exam.questions;

    questions.forEach((question: any) => {
      const hasAnswer = this.answers.controls.some((control) => control.value.question__id === question.question__id);
      
      if (!hasAnswer) {
        this.answers.push(this.fb.group({
          
          question__id: question.question__id,
          anser__id: '',
          answer__text: ''
        }));
      }
      
    });
  }
  submitAnswers(): void {
    console.log("listfile", this.listFile)
const dataAnswers={
  ans: this.AnswersForm.value,
  files: this.listFile,
}
this.checkAnswers()
    console.log(dataAnswers);
    this.examAnswers.createAnswers(dataAnswers).subscribe(
      (response: any) => {
        alert('Successfully created');
        console.log('success', response);
      },
      (error: { error: { message: any } }) => {
        console.log('error', error);
      }
    );
  }
}
