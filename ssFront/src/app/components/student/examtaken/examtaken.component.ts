import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ExamService } from '../../teacher/serviceTeacher/exam.service';

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
    ReactiveFormsModule

  ],
  templateUrl: './examtaken.component.html', 
  styleUrls: ['./examtaken.component.css']
})
export class ExamtakenComponent {
  exam__id = 15;
  Exam: any;
  AnswersForm: FormGroup;

  constructor(private examService: ExamService, private fb: FormBuilder) {
    this.AnswersForm = this.fb.group({
      answers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    console.log('hellooo');
    this.fetchExam();
  }

  fetchExam(): void {
    this.examService.getExamByid(this.exam__id).subscribe(
      (data) => {
        console.log('Response from backend:', data);
        this.Exam = this.formatExamData(data);
        
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }

  formatExamData(exam: any): any {
    return {
      exam__id: exam.exam__id,
      subject: exam.subject,
      questions: exam.questions.map((question: any) => ({
        question__id: question.question__id,
        question__text: question.question__text,
        question__type: question.question__type,
        reponses: question.reponses.map((reponse: any) => ({
          reponse__id: reponse.reponse__id,
          reponse__text: reponse.reponse__text,
          reponse__statut: reponse.reponse__statut
        }))
      }))
    };
  }
  
 

  onCheckboxChange(event: any, question: any, reponse: any): void {
    const index = this.answers.controls.findIndex((x) => x.value.answer__id === reponse.reponse__id);
  
    if (index === -1) {
      // If the answer is not in the array, add it
      this.answers.push(this.fb.group({
        question__id: question.question__id,
        answer__id: reponse.reponse__id,
        answer__text: reponse.reponse__text
      }));
    } else {
      // If the answer is already in the array, remove it
      this.answers.removeAt(index);
    }
  }
  answer(value: string, questionId: number) {
    this.answers.push(this.fb.group({
      question__id: questionId,
      answer__id: '',
      answer__text: value
    }));
    console.log(this.AnswersForm.value)
  }

  get answers(): FormArray {
    return this.AnswersForm.get('answers') as FormArray;
  }
  submitAnswers(): void {
    console.log(this.AnswersForm.value);
    // You can now send the form value to your backend service
    
  }
}
