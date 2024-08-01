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
import { MessageService } from 'primeng/api';

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
  @Input() questionEdit: any;
  @Output() questionAdded = new EventEmitter<any>(); 
  questionsForm: FormGroup;
  subjectForm!: FormGroup;
  reponsesForm!: FormGroup;
  fileQuest: any[] = [];
  questarr: any[] = [];

  questionFile: any = [];
  ExistFile: any = [];
  dataquest: any = {};
  examid = 1;
  subjects: any = [];
  sub = 'a';
  selectedSubject: any;
  showrep = false;
  showQuestionField: boolean = true;
  fileIds: any = [];
  QuestFileInitialEdit: any = [];

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
    private tokenService: TokenServiceService ,
    private teacherService: TeacherService,
    private questService: QuestionService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService : MessageService
    
  ) {
    this.subjectForm = this.fb.group({
      selectedSubject: new FormControl<any | null>(null),
    });

    this.questionsForm = this.fb.group({
      question__text: [
        '',
        [Validators.required],
      ],
      note: ['', [Validators.required, rangeNumber(0, 20)]],
      question__type: ['', Validators.required],
      question__subject: '',
      user__id: [this.user__id, Validators.required],
      reponses: this.fb.array([]),
    });
  }
  createAnswerFormGroup() {
    this.reponsesForm = this.fb.group({
      reponse__text: ['', Validators.required],
      reponse__statut: [false],
    });
    return this.reponsesForm;
  }
  initializeForm(questionEdit: any): void {
    // Set the main form controls' values
    this.questionsForm.patchValue({
      question__text: questionEdit.question__text,
      note: questionEdit.note,
      question__type: questionEdit.question__type,
      question__subject: questionEdit.question__subject,
    });

    // Clear existing reponses
    this.reponses.clear();

    // Add reponse controls
    questionEdit.reponses.forEach((reponse: any) => {
      this.reponses.push(
        this.fb.group({
          reponse__id: reponse.reponse__id,
          reponse__text: reponse.reponse__text,
          reponse__statut: reponse.reponse__statut,
          question__id: reponse.question__id,
        })
      );
    });
  }

  findSubject(subjectName: string): any {
    console.log('Searching for subject name:', this.subjects);
    let foundSubject = null;
    this.subjects.forEach((subject: { subject__name: string }) => {
      console.log('Checking subject:', subject.subject__name);
      if (subject.subject__name.trim() === subjectName.trim()) {
        foundSubject = subject;
      }
    });

    if (!foundSubject) {
      console.error('No subject found for name:', subjectName);
    } else {
      console.log('Found subject:', foundSubject);
    }

    return foundSubject;
  }

  ngOnInit(): void {
    console.log(
      'questionEditquestionEd questionEdit itquestionEditquestionEdit',
      this.questionEdit
    );

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
            this.addAnswer();
          }
        }
      });

    this.teacherService.getTecher(this.user__id).subscribe(
      (data: Teacher[]) => {
        const teacher = data;
        this.subjects = teacher[0].subjects;
        console.log('subjectshhhhhhsss is is sis', teacher[0].subjects);
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

    if (this.questionEdit) {
      this.initializeForm(this.questionEdit);
      if (this.questionEdit.file && Array.isArray(this.questionEdit.file)) {
        this.questionEdit.file.forEach((file: any) => {
          if (file) {
            const extension = getFileExtension(file.file__name);
            const fileType = getFileType(extension);
            this.ExistFile.push({
              name: file.file__name,
              type: fileType,
              url: file.file__path,
              fileId: file.file__id,
            });

            this.QuestFileInitialEdit.push({
              name: file.file__name,
              type: fileType,
              url: file.file__path,
              fileId: file.file__id,
            });
          }
        });
      }

      console.log('file', this.questionEdit.file);

      console.log('ExistFile', this.ExistFile);

      console.log('QuestFileInitialEdit', this.QuestFileInitialEdit);
      this.subjectForm.get('selectedSubject')?.setValue(this.subjectValue);
    }
  }

  deleteFile(fileid: number, index: number) {
    this.ExistFile.splice(index, 1);
    this.fileIds.push(fileid);

    console.log('fileIds is ::::>', this.fileIds);
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

console.log("hhsjas sallem maman " )

    this.questionsForm.markAllAsTouched();
    console.log("hhsjas sallem maman ",this.questionsForm )
   
    if (this.questionsForm.valid) {
      const reponsesArray = this.questionsForm.get('reponses') as FormArray;
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', reponsesArray);
      Object.values(reponsesArray.controls).forEach(
        (control: AbstractControl) => {
          control.markAsTouched();
        }
      );
      console.log(this.questarr);
      const quVal = this.questionsForm.value;

      this.dataquest = {
        question: this.questionsForm.value,
        files: this.questionFile,
      };
      this.questarr.push(this.dataquest);
      console.log('mmddbdbdbdbdbdbdbdbdb', this.dataquest);

      this.questService.createquestion(this.dataquest).subscribe(
        (response: any) => {
         
          console.log('seccess', response);
          console.log('ffffilessss', this.dataquest.files);
          this.questionAdded.emit(response);
          this.questionsForm.reset()
          this.resetForm()
          this.fileQuest = [];
        },
        (error: { error: { message: any } }) => {
          console.log('errrr', error);
          if(error.error?.message){
         
            this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
            }
        }
      );
    }
  }


  resetForm(): void {

    if (!this.selectedSubject && this.subjectValue) {
      this.questionsForm.patchValue({
        question__subject: this.subjectValue,
      });
    }


    this.questionsForm.patchValue({
      user__id: [this.user__id, Validators.required],
    
    });
 
   
  }



  checkUpdate(): boolean {


    
      return (
        this.questionsForm.touched ||  // Check if the form has been touched
      this.fileIds.length > 0 ||  // Compare initial and current file data
        this.fileQuest.length > 0  // Check if there are any files in the fileQuest array
      );
    }
  updateQuestion() {
    this.questionsForm.markAllAsTouched();
    this.reponses.controls.forEach((control) => control.markAllAsTouched());
    // this.reponsesArray = this.questionsForm.get('reponses') as FormArray;
    const reponsesArray = this.questionsForm.get('reponses') as FormArray;
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', reponsesArray);
    if (this.questionsForm.valid) {
      const reponsesArray = this.questionsForm.get('reponses') as FormArray;
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', reponsesArray);
      Object.values(reponsesArray.controls).forEach(
        (control: AbstractControl) => {
          control.markAsTouched();
        }
      );

      this.dataquest = {
        question: this.questionsForm.value,
        files: this.questionFile,
      };

      this.questService
        .updateQuestion(this.dataquest, this.questionEdit.question__id)
        .subscribe(
          (response: any) => {
            this.fileIds.forEach((id: any) => {
              if (id) {
                console.log('fiiiid', id);
                this.questService.deleteFiles(id, 'question').subscribe(
                  (response: any) => {
                    console.log('hy delete  file bro');
                  },
                  (error: { error: { message: any } }) => {
                    console.log('error', error);
                  }
                );
              }
            });
            this.questionAdded.emit(response);
            
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Update' });

            console.log('success', response);
          },
          (error: { error: { message: any } }) => {
            console.log('error', error);
            if(error.error?.message){
         
              this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
              }
          }
        );
    }
  }
}
