import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';
import { MatTooltipModule } from '@angular/material/tooltip';
import { url } from 'inspector';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExamService } from '../exam.service';
import { GlobalConstants, rangeNumber } from '../../../shared/global-constants';
import { ListviewComponent } from "../listview/listview.component";

@Component({
    selector: 'app-add-exam',
    standalone: true,
    templateUrl: './add-exam.component.html',
    styleUrl: './add-exam.component.css',
    imports: [CommonModule, MatTooltipModule, ReactiveFormsModule, FormsModule, ListviewComponent]
})
export class AddExamComponent {
  examForm: FormGroup;
  questionsForm: FormGroup;
  selectedOption: string = '';
  urls: any[] = [];
  questarr: any[] = [];
  listFile: any = {};
  dataexam: any = {};
typ:string='';
ext:any

showrep=false;

setswitch() {
  this.showrep = !this.showrep;
}
  constructor(private examService:ExamService,  private fb: FormBuilder) {
    this.examForm = this.fb.group({
      exam__name: ['',[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]], // Required validator for exam name
      exam__type: ['offline', Validators.required], // Required validator for exam type
      // files: this.fb.array([]),
      questions:{}
      //  this.fb.array([
        // this.fb.group({
        //   questionText: [''],
        //   note: [''],
        //   question__type: [''],
        //   reponses: this.fb.array([
        //     // Define the 'reponses' FormArray here
        //     this.createAnswerFormGroup(),
        //     this.createAnswerFormGroup(),
        //     this.createAnswerFormGroup(),
        //   ]),
        // }),
      // ]),
    });
    // this.typ=this.typeaExam();
    this.questionsForm = this.fb.group({
      question__text: ['',[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      note: ['',[Validators.required, rangeNumber(0,20)]],
      question__type: ['', Validators.required],
      reponses: this.fb.array([
        // Define the 'reponses' FormArray here
        // this.createAnswerFormGroup(),
        // this.createAnswerFormGroup(),
        // this.createAnswerFormGroup(),
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
    this.examForm.get('exam__type')?.valueChanges.subscribe((typeexamValue) => {
      this.questionsForm.patchValue({ question__type: typeexamValue });
      this.typ=typeexamValue;
    });
       this.questionsForm.get('question__type')?.valueChanges.subscribe((value) => {
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
 formReponses() {
    return    this.questionsForm.get('reponses') as FormArray;

 }
  // addQuestion() {
  //   this.questions.push(this.questarr);
  // }
  private markisTouched(formGroup: FormGroup | FormArray) {
    (Object as any).values(formGroup.controls).forEach((control: FormGroup<any> | FormArray<any>) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markisTouched(control);
      } else {
        formGroup.markAsTouched();
      }
    });
  }
  addQuestionAndReset() {
    const reponseForm = this.formReponses()
    if (reponseForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.questionsForm.markAllAsTouched();
      this.markisTouched(this.questionsForm.get('reponses') as FormArray);
      return;
     
    }
   
    console.log(this.questarr);
    const quVal = this.questionsForm.value;
    this.questarr.push(quVal);
    console.log(quVal);
   this.questionsForm.reset();
   this.questionsForm.patchValue({ question__type: this.typ });
   
  }

  // createQuestionFormGroup() {
  //   return this.fb.group({
  //     questionText: [''],
  //     note: [''],
  //     question__type: [''],
  //     reponses: this.fb.array([
  //       this.createAnswerFormGroup(),
  //       this.createAnswerFormGroup(),
  //       this.createAnswerFormGroup(),
  //     ]),
  //   });
  // }



  saveexam() {
    this.examForm.patchValue({
      questions: this.questarr
    });
    if (this.examForm.invalid || this.questionsForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.examForm.markAllAsTouched();
      this.questionsForm.markAllAsTouched();
      return;
    }
    this.dataexam = {
      exam: this.examForm.value,
      file:  this.listFile[0]
    };
    console.log(this.questarr);
    console.log(this.examForm.value);
    console.log("dataexam",this.dataexam);
    console.log("listFile",this.listFile);


  }
  onSubmit() {
    console.log(this.questarr);
    console.log(this.examForm.value);


    this.examService.createExam(this.dataexam).subscribe(
      (response: any) => {
       
        alert('Successfully create');
        console.log('seccess', response);
      },
      (error: { error: { message: any; }; })=>{
        //this.ngxService.stop();
        console.log("errrr",error)
        // if(error.error?.message){
        //   this.responseMessage = error.error?.message;
        // }else{
        //   this.responseMessage = GlobalConstants.genericError;
        // }
        // // alert(this.responseMessage +" " +GlobalConstants.error);
        // this.snackbarService.openSnackBar(this.responseMessage , GlobalConstants.error);
      })

    
    // Here you can send the form data to your backend or perform other actions
  }
}
