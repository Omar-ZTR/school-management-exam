import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
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
import { ExamService } from '../serviceTeacher/exam.service';
import { GlobalConstants, rangeNumber } from '../../../shared/global-constants';
import { ListviewComponent } from '../listview/listview.component';
import { QuestionService } from '../serviceTeacher/question.service';
import { AddQuestionComponent } from "../add-question/add-question.component";
import { CalandarfullComponent } from "../../calandarfull/calandarfull.component";

@Component({
    selector: 'app-add-exam',
    standalone: true,
    templateUrl: './add-exam.component.html',
    styleUrl: './add-exam.component.css',
    imports: [
        CommonModule,
        MatTooltipModule,
        ReactiveFormsModule,
        FormsModule,
        ListviewComponent,
        AddQuestionComponent,
        CalandarfullComponent
    ]
})
export class AddExamComponent {
  examForm: FormGroup;
  
  selectedOption: string = '';
  urls: any[] = [];
  

  listFile: any = {};
  
  dataexam: any = {};
  dataPLan: any ;
  typ: string = '';
  ext: any;
  questarr: any;
  
  showCalendar: boolean = false;
 
  constructor(private elementRef: ElementRef, private examService: ExamService, private questService: QuestionService, private fb: FormBuilder) {
    this.examForm = this.fb.group({
      subject: [
        '',
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ], // Required validator for exam name
      exam__type: ['offline', Validators.required], 
     
      questions: {},
   
    });
  
   
  }
 


  
   isMonthView: boolean = true;

  ngOnInit(): void {
    this.loadQuestions()

  }
 
 
   onIsMonthViewChange(value: boolean) {
      this.isMonthView = value;
      console.log("vvvvvvvvvvvvvvvvvv: .",this.isMonthView)
    }

  
    

  loadQuestions() {
    this.questService.getfakeQuestion().subscribe(
      (data) => {
        this.questarr = data;
      },
      (error) => {
        console.error('Error fetching fake questions', error);
      }
    );
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



  saveexam() {
    this.examForm.patchValue({
      questions: this.questarr,
    });
    if (this.examForm.invalid ) {
      
      this.examForm.markAllAsTouched();
   
      return;
    }
    this.dataexam = {
      exam: this.examForm.value,
      file: this.listFile[0],
    };

  }
  
  onSubmit() {
   
console.log(this.dataexam)
    this.examService.createExam(this.dataexam).subscribe(
      (response: any) => {
        alert('Successfully create');
        console.log('seccess', response);
        this.showCalendar = true;
         this.dataPLan = response.exam__id;
        
        
       
      },
      (error: { error: { message: any } }) => {
        //this.ngxService.stop();
        console.log('errrr', error);
        // if(error.error?.message){
        //   this.responseMessage = error.error?.message;
        // }else{
        //   this.responseMessage = GlobalConstants.genericError;
        // }
        // // alert(this.responseMessage +" " +GlobalConstants.error);
        // this.snackbarService.openSnackBar(this.responseMessage , GlobalConstants.error);
      }
    );


  }
}
