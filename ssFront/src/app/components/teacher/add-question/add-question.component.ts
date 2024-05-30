import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../serviceTeacher/question.service';
import { GlobalConstants, rangeNumber } from '../../../shared/global-constants';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ListviewComponent } from '../listview/listview.component';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [ CommonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    ListviewComponent,],
  templateUrl: './add-question.component.html',
  styleUrl: '../add-exam/add-exam.component.css'
})
export class AddQuestionComponent {
  @Output() questionAdded = new EventEmitter<void>();
  questionsForm: FormGroup;


  fileQuest: any[] = [];
  questarr: any[] = [];
  fake__id:number =-1;
  questionFile: any = [];
 
  dataquest: any = {};


  showrep = false;

  setswitch() {
    this.showrep = !this.showrep;
  }
  constructor( private questService: QuestionService, private fb: FormBuilder) {
   
    this.questionsForm = this.fb.group({
      question__text: [
        '',
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      note: ['', [Validators.required, rangeNumber(0, 20)]],
      question__type: ['', Validators.required],
      exam__id: this.fake__id,
      reponses: this.fb.array([
       
      ]),
    });
  }
  createAnswerFormGroup() {
    return this.fb.group({
      reponse__text: ['', Validators.required],
      reponse__statut: [false],
    });
  }

  ngOnInit(): void {
   
    this.questionsForm
      .get('question__type')
      ?.valueChanges.subscribe((value) => {
        const reponses = this.questionsForm.get('reponses') as FormArray;
        while (reponses.length) {
          reponses.removeAt(0);
        }
        if (value === 'QCM') {
          for (let i = 0; i < 3; i++) {
            reponses.push(this.createAnswerFormGroup());
          }
        }
      });
  }
  addAnswer(): void {
    const reponses = this.questionsForm.get('reponses') as FormArray;
    reponses.push(this.createAnswerFormGroup());
  }

  removeAnswer(index: number): void {
    const reponses = this.questionsForm.get('reponses') as FormArray;
    reponses.removeAt(index);
  }

  
  async QuestionFiles(event: any) {
    let files = event.target.files;

    if (files) {
      for (let file of files) {
        this.questionFile.push(file);
        const extension = getFileExtension(file.name);
        const fileType = getFileType(extension);

        await this.readFileAsync(file).then((url: any) => {
          this.fileQuest.push({ name: file.name, type: fileType, url: url });
        });
      }
    }
    console.log(this.questionFile);
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
    
    this.fileQuest.splice(index, 1);
  }
  formReponses() {
    return this.questionsForm.get('reponses') as FormArray;
  }
 
  private markisTouched(formGroup: FormGroup | FormArray) {
    (Object as any)
      .values(formGroup.controls)
      .forEach((control: FormGroup<any> | FormArray<any>) => {
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.markisTouched(control);
        } else {
          formGroup.markAsTouched();
        }
      });
  }
  addQuestionAndReset() {
    const reponseForm = this.formReponses();
    if (reponseForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.questionsForm.markAllAsTouched();
      this.markisTouched(this.questionsForm.get('reponses') as FormArray);
      return;
    }

    console.log(this.questarr);
    const quVal = this.questionsForm.value;

    this.dataquest = {
      question: this.questionsForm.value,
      files: this.questionFile[0],
    };
    this.questarr.push(this.dataquest);
    console.log(this.questarr);

    

    this.questService.createquestion(this.dataquest).subscribe(
      (response: any) => {
        alert('Successfully create');
        console.log('seccess', response);
        this.questionAdded.emit();
        this.questionsForm.reset();
        this.fileQuest=[]
      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
        
      }
    );

   
    // this.questionsForm.patchValue({ question__type: this.typ });
  }

}
