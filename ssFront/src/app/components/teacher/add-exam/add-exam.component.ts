import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';
import { MatTooltipModule } from '@angular/material/tooltip';
import { url } from 'inspector';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExamService } from '../../../services/serviceTeacher/exam.service';
import { GlobalConstants, rangeNumber } from '../../../shared/global-constants';
import { ListviewComponent } from '../listview/listview.component';
import { QuestionService } from '../../../services/serviceTeacher/question.service';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { CalandarfullComponent } from '../../calandarfull/calandarfull.component';
import { DropdownModule } from 'primeng/dropdown';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { InputTextModule } from 'primeng/inputtext';
import { TeacherService } from '../../../services/serviceTeacher/teacher.service';
import { Teacher } from '../../Admin/manage-teacher/manage-teacher.component';
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
    CalandarfullComponent,
    DropdownModule,
    InputTextModule,
  ],
})
export class AddExamComponent {
  examForm: FormGroup;
  subjectForm!: FormGroup<any>;
  selectedOption: string = '';

  subjectValue = '';
  examType: string = '';
  listFile: any = [];
  urls: any[] = [];
  dataexam: any = {};
  dataPLan: any;
  typ: string = '';
  ext: any;
  questarr: any[] = [];

  showCalendar: boolean = false;
  showAlert: boolean = false;
  questions: any;
  showQuestionField: any;
  sub: any;
  selectedSubject: any;
  subjects: any;
  user__id = this.tokenService.getUserIdFromToken();
  typeGlobal: string = 'offline';
  Allquestions!: any[];
  group!: any[];

  errQuestion: boolean=false
  errFile: boolean=false

  changeTypeGlobal(value: string) {
    this.typeGlobal = value;
    if (value == 'offline') {
      this.examForm.patchValue({ exam__type: '' });
    } else {
      this.examForm.patchValue({ exam__type: '' });
    }
    console.log('ssssss', this.typeGlobal);
  }

  constructor(
    private teacherService: TeacherService,
    private elementRef: ElementRef,
    private examService: ExamService,
    private questService: QuestionService,
    private fb: FormBuilder,
    private tokenService: TokenServiceService
  ) {
    this.examForm = this.fb.group({
      subject: ['', Validators.required], // Required validator for exam name
      exam__type: ['', Validators.required],
      obligatoire: ['true', Validators.required],
      user__id: [this.user__id, Validators.required],
      exam__title: [
        '',
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      questions: {},
    });
    this.subjectForm = this.fb.group({
      selectedSubject: new FormControl<any | null>(null, [Validators.required]),
    });
  }

  toggleCalendar() {
    this.isMonthView=true
    this.showCalendar = !this.showCalendar;
    
  }

  isMonthView: boolean = true;

  ngOnInit(): void {
    // this.loadQuestions()
    this.examForm.get('subject')?.valueChanges.subscribe((value) => {
      this.subjectValue = value;
    });
    this.examForm.get('exam__type')?.valueChanges.subscribe((value) => {
      this.examType = value;
    });
    this.teacherService.getTecher(this.user__id).subscribe(
      (data: Teacher[]) => {
        const teacher = data;
        this.subjects = teacher[0].subjects;
        this.Allquestions = teacher[0].questions;
        this.group=teacher[0].groups
        this.filterQuestions();
        console.log('subjectshhhhhhsss is is sis', teacher[0].subjects);
        console.log('subjectshhhhhhsss is is sis', teacher[0].questions);
      },
      (error) => {
        console.error('Error fetching subjects', error);
      }
    );

    this.subjectForm
      .get('selectedSubject')
      ?.valueChanges.subscribe((selectedSubject: any) => {
        console.log('Selected Subject:', selectedSubject);

        if (!selectedSubject && this.subjectValue) {
          this.examForm.patchValue({
            subject: this.subjectValue,
          });
        } else {
          this.sub = selectedSubject?.subject__name || '';
          console.log('sssssaaaaaaaaaaaaassssss', this.sub);
          this.examForm.patchValue({
            subject: this.sub,
          });
        }
        this.filterQuestions();
      });

    if (!this.selectedSubject && this.subjectValue) {
      this.examForm.patchValue({
        subject: this.subjectValue,
      });
    }
  }

  filterQuestions() {
    console.log('ddddd)))))))))))))))))))))))))))');
    this.questions = this.Allquestions.filter(
      (Q: { question__subject: any }) => Q.question__subject == this.sub
    );
  }

  statutExam: string = 'Course';
  Status: boolean = true;
  toggleStatut(): void {
    this.Status = !this.Status;

    this.examForm.patchValue({
      obligatoire: this.Status,
    });
  }

  onIsMonthViewChange(value: boolean) {
    this.isMonthView = value;
    console.log('vvvvvvvvvvvvvvvvvv: .', this.isMonthView);
  }

  loadQuestions(response: any): void {
    console.log('Question added with response:', response);
    this.questarr.push(response);
    this.errQuestion=false
    const index = this.questions.indexOf(response);
    if (index > -1) {
      this.questions.splice(index, 1);
    }
  }

  removeQuestions(response: any): void {
    console.log('Question removed with response:', response);
    this.questions.push(response);

    const index = this.questarr.indexOf(response);
    if (index > -1) {
      this.questarr.splice(index, 1);
    }
  }

  async detectFiles(event: any) {
    let files = event.target.files;
    this.listFile = [];
    this.urls = [];

    if (files) {
      for (let file of files) {
        this.listFile.push(file);
        this.errFile =false;
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

  resetForm() {
    this.typeGlobal = 'offline';
    this.examForm.reset({
      user__id: this.user__id,
      obligatoire: true,
      subject: this.sub,
      exam__type: 'offline',
      questions: {},
    });
    this.listFile = [];
    this.urls = [];
    this.questarr = [];
  }
  showSuccessAlert(callback?: () => void): void {
    this.showAlert = true;
    setTimeout(() => {
      this.closeAlert();
      if (callback) {
        callback();
      }
    }, 1000); // Hide the alert after 3 seconds
  }

  closeAlert(): void {
    this.showAlert = false;
  }

  savePlan() {
    Object.values(this.examForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    console.log('s........', this.examForm.valid);
    console.log('s...sss....', this.user__id);
    console.log('s...sss....', this.examForm.value);
    if (this.examForm.valid) {

      if(this.examForm.value.exam__type ==='Normal' && this.questarr.length ==0){
        console.log("gggggGGGggggGGGGGGgggggGGG")
        this.errQuestion =true
        return;
      }


      this.examForm.patchValue({
        questions: this.questarr,
      });
      if (this.examForm.invalid) {
        this.examForm.markAllAsTouched();

        return;
      }
      console.log("listfile",this.listFile)
      if((this.examForm.value.exam__type ==='FileOff'||this.examForm.value.exam__type ==='File')&&(!this.listFile||this.listFile.length==0) ){
        console.log("gggggGGGggggGGGGGGgggggGGG")
        this.errFile =true
        return;
      }

      this.dataexam = {
        exam: this.examForm.value,
        files: this.listFile,
      };

      console.log(this.dataexam);
      this.examService.createExam(this.dataexam).subscribe(
        (response: any) => {
          this.showSuccessAlert(() => {
            this.showCalendar = true;
          });
          console.log('seccess', response);

          this.dataPLan = response.exam__id;
          this.resetForm();
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


  Cancel(){
    this.examForm.patchValue({ exam__type: '' });
    this.questarr = []
  }

  save() {
    Object.values(this.examForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.examForm.valid) {

      if(this.examForm.value.exam__type ==='Normal' && this.questarr.length ==0){
        console.log("gggggGGGggggGGGGGGgggggGGG")
        this.errQuestion =true
        return;
      }
      console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
      this.examForm.patchValue({
        questions: this.questarr,
      });
      if (this.examForm.invalid) {
        this.examForm.markAllAsTouched();

        return;
      }


      if((this.examForm.value.exam__type ==='FileOff'||this.examForm.value.exam__type ==='File')&&(!this.listFile||this.listFile.length==0) ){
        console.log("gggggGGGggggGGGGGGgggggGGG")
        this.errFile =true
        return;
      }


      this.dataexam = {
        exam: this.examForm.value,
        files: this.listFile,
      };

      console.log(this.dataexam);
      this.examService.createExam(this.dataexam).subscribe(
        (response: any) => {
          this.showSuccessAlert(() => {});
          console.log('seccess', response);

          this.dataPLan = response.exam__id;
          this.resetForm();
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
}
