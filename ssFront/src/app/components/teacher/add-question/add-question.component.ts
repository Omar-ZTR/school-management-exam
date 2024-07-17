import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuestionService } from '../../../services/serviceTeacher/question.service';
import { GlobalConstants, rangeNumber } from '../../../shared/global-constants';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ListviewComponent } from '../listview/listview.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { TeacherService } from '../../../services/serviceTeacher/teacher.service';
import { Teacher } from '../../Admin/manage-teacher/manage-teacher.component';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    ListviewComponent,
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './add-question.component.html',
  styleUrl: '../add-exam/add-exam.component.css',
})
export class AddQuestionComponent {
  @Input() subjectValue: any;
  @Input() examType: any;

  @Output() questionAdded = new EventEmitter<any>();
  questionsForm: FormGroup;
  subjectForm!: FormGroup;
  reponsesForm!: FormGroup;
  fileQuest: any[] = [];
  questarr: any[] = [];

  questionFile: any = [];

  dataquest: any = {};
  examid = 1;
  subjects: any;
  sub = 'a';
  selectedSubject: any;
  showrep = false;
  showQuestionField: boolean = true;
  
  checkRoute() {
    const currentRoute = this.router.url;
    const hideRoutes = [
      '/teacher/addQuestion',
      '/student/addQuestion',
      '/admin/addQuestion',
    ];
    this.showQuestionField = hideRoutes.includes(currentRoute);
    console.log(this.showQuestionField, currentRoute);
  }
  setswitch() {
    this.showrep = !this.showrep;
  }



  user__id = this.tokenService.getUserIdFromToken();

  constructor(
    private teacherService: TeacherService,
    private questService: QuestionService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenServiceService
  ) {
    this.subjectForm = this.fb.group({
      selectedSubject: new FormControl<any | null>(null),
    });

    this.questionsForm = this.fb.group({
      question__text: [
        '',
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      note: ['', [Validators.required, rangeNumber(0, 20)]],
      question__type: ['', Validators.required],
      question__subject: '',
      reponses: this.fb.array([]),
    });
  }
  createAnswerFormGroup() {
    this.reponsesForm=this.fb.group({
      reponse__text: ['', Validators.required],
      reponse__statut: [false],
    });
    return this.reponsesForm
  }

  ngOnInit(): void {
    console.log('kkkkkkkkkkkkkkkkkkkkkkinput', this.examType);
    this.questionsForm
      .get('question__type')
      ?.setValue(this.examType || 'Normal');
    this.checkRoute();
    this.questionsForm
      .get('question__type')
      ?.valueChanges.subscribe((value) => {
        const reponses = this.questionsForm.get('reponses') as FormArray;
        while (reponses.length) {
          reponses.removeAt(0);
        }
        if (value === 'QCM') {
          for (let i = 0; i < 3; i++) {
            this.addAnswer()
          }
        }
      });


    this.teacherService.getTecher(this.user__id).subscribe(
      (data: Teacher[]) => {
       const teacher = data;
       this.subjects=teacher[0].subjects
        console.log("subjectshhhhhhsss is is sis",teacher[0].subjects)
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
          this.questionsForm.patchValue({
            question__subject: this.subjectValue,
          });
        } else {
          this.sub = selectedSubject?.subject__name || '';
          console.log('sssssaaaaaaaaaaaaassssss', this.sub);
          this.questionsForm.patchValue({
            question__subject: this.sub,
          });
        }
      });

    if (!this.selectedSubject && this.subjectValue) {
      this.questionsForm.patchValue({
        question__subject: this.subjectValue,
      });
    }
  }
  get reponses(): FormArray {
    return this.questionsForm.get('reponses') as FormArray;
  }
  addAnswer(): void {
  
    let ctrl = <FormArray>this.questionsForm.controls['reponses'];
    this.reponses.push(this.createAnswerFormGroup()); 
     
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
  
    this.questionsForm.markAllAsTouched();
    this.reponses.controls.forEach(control => control.markAllAsTouched());
    // this.reponsesArray = this.questionsForm.get('reponses') as FormArray;
    const reponsesArray = this.questionsForm.get('reponses') as FormArray;
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', reponsesArray);
    if (this.questionsForm.valid) {
      const reponsesArray = this.questionsForm.get('reponses') as FormArray;
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', reponsesArray);
      Object.values(reponsesArray.controls).forEach((control: AbstractControl) => {
        control.markAsTouched();
      });
      console.log(this.questarr);
      const quVal = this.questionsForm.value;

      this.dataquest = {
        question: this.questionsForm.value,
        files: this.questionFile,
      };
      this.questarr.push(this.dataquest);
      console.log("mmddbdbdbdbdbdbdbdbdb",this.dataquest);

      this.questService.createquestion(this.dataquest).subscribe(
        (response: any) => {
          alert('Successfully create');
          console.log('seccess', response);
          console.log('ffffilessss', this.dataquest.files);
          this.questionAdded.emit(response);
          this.questionsForm.reset();
          this.fileQuest = [];
        },
        (error: { error: { message: any } }) => {
          console.log('errrr', error);
        }
      );
    }
    // this.questionsForm.patchValue({ question__type: this.typ });
  }
}
