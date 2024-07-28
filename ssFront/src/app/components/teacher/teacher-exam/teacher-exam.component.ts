import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { ExamService } from '../../../services/serviceTeacher/exam.service';
import { MenuItem } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { QuestionService } from '../../../services/serviceTeacher/question.service';
export interface Exam {
  exam__id: any;
  subject: string;
  exam__type: string;
  reservation: any[];
  // Add other properties if needed
}
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CalandarService } from '../../../services/serviceTeacher/calandar.service';
import { SalleService } from '../../../services/servicesUtils/salle.service';
import {
  CalandarfullComponent,
  endTimeValidator,
} from '../../calandarfull/calandarfull.component';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { DropdownModule } from 'primeng/dropdown';
import { TeacherService } from '../../../services/serviceTeacher/teacher.service';
import { Teacher } from '../../Admin/manage-teacher/manage-teacher.component';
import { GlobalConstants, rangeNumber } from '../../../shared/global-constants';
import { disableCursor } from '@fullcalendar/core/internal';
@Component({
  selector: 'app-teacher-exam',
  standalone: true,
  templateUrl: './teacher-exam.component.html',
  styleUrl: './teacher-exam.component.css',
  imports: [
    TableModule,
    CommonModule,
    SpeedDialModule,
    ButtonModule,
    HttpClientModule,
    RouterOutlet,
    RouterModule,
    DialogModule,
    ImageModule,
    FieldsetModule,
    PanelModule,
    ReactiveFormsModule,
    FormsModule,
    OverlayPanelModule,
    InputTextModule,
    CalandarfullComponent,
    DropdownModule,
  ],
  styles: [
    `
      :host ::ng-deep .p-dropdown {
        position: unset !important ;
      }
      :host ::ng-deep .p-dropdown .p-dropdown-clear-icon {
        right: 0 !important;
      }

      :host ::ng-deep .p-dropdown-clear-icon {
        position: relative !important;
      }

      :host ::ng-deep .p-panel .p-panel-header {
        border: 2px solid #e5e7eb !important;

        background: #ffffff !important;
        color: #374151;
      }

      :host ::ng-deep .p-fieldset .p-fieldset-legend {
        background: #ffffff !important;
        border: none !important;
      }

      :host ::ng-deep .p-fieldset {
        border: 1px solid #e5e7eb !important;
        margin-bottom: 20px !important;
      }
      :host ::ng-deep .p-dialog-header {
        font-family: 'Poppins', sans-serif !important;
        font-weight: 800 !important;
        font-style: italic !important;
        font-size: 30px !important;
      }
      :host ::ng-deep .p-fieldset-content{
      padding: 1rem !important ;
    display: flex !important ;
    flex-direction: column !important ;
    gap: 30px !important ;

  }
    `,
  ],
})

// overflow-y: visible !important;
export class TeacherExamComponent {
  [x: string]: any;
  Exams: Exam[] = [];
  items: MenuItem[] | null = null;
  first = 0;
  id_question!: number;
  QuestionUpdate: any;
  NoUpdate: boolean = true;
  rows = 10;
  Exam: any;
  fileExamInit: any[] = [];
  examType: any;
  groupedQuestions: { [key: string]: any[] } = {};
  examShudeled: any;
  visible: boolean = false;
  fileIds: any[] = [];
  questionForms: FormGroup;
  isEditing: boolean = false;
  dataquest!: { question: any; files: any };
  dataExam!: {files: any };
  questionFile: any = [];
  QuestFileInitialEdit: any = [];
  FileAdds: any = [];
  Fileupload: any = [];
  examPlan: any;
  firstDate: any;
  updatecalendar: boolean = false;
  eventForm!: FormGroup;
  salles: any;
  AllSalles: any;
  reservdata: any;
  deleteid: any;
  deleteform: any;
  deletexam: boolean = false;
  showCalendar: boolean = false;
  group!: any[];
  urlsSuport: any[] = [];
  listsuportFile: any[] = [];
  existsuportFile: any[] = [];
  supportUp:boolean = false;
  IdsSuport: any[] = [];
  idExamSup!:any;
  examdesc:string='';
  oblig!:boolean;
  supEdit :boolean=false
  user__id = this.tokenService.getUserIdFromToken();
  constructor(
    private examService: ExamService,
    private salleService: SalleService,
    private questService: QuestionService,
    private teacherService: TeacherService,
    private fb: FormBuilder,
    private calandarService: CalandarService,
    private tokenService: TokenServiceService
  ) {
    this.questionForms = this.fb.group({
      question__text: [
        '',
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      note: ['', [Validators.required, rangeNumber(0, 20)]],

      reponses: this.fb.array([]),
      question__type: [
        '',[Validators.required]
       
      ],

    });
  }

  update: boolean = false;
  add: boolean = false;
  toggleDelete(obj: any, exId: number, type: string) {
    if (type === 'exam') {
      this.deleteform = {
        id: obj.exam__id,
        name: obj.exam__title,
        type: type,
      };
    } else {
      this.deleteform = {
        id: obj.question__id,
        name: obj.question__text,
        QType: obj.question__type,
        type: type,
        exam__id: exId,
      };
    }
    console.log('deletform is', this.deleteform);
    this.deletexam = !this.deletexam;
    if (!this.deletexam) {
      this.deleteid = '';
    } else {
      this.deleteid = this.deleteform.id;
    }
  }
  onSalleSelect(): void {
    const startDate = this.eventForm.get('startDate')?.value;
    const startHour = this.eventForm.get('startTime')?.value;
    const endHour = this.eventForm.get('endTime')?.value;
    // const nb__place = this.eventForm.get('nb')?.value;
    console.log('<>>sssseeevnt', this.eventForm.value);
    const fetchSalleData = {
      starthour: new Date(`${startDate}T${startHour}`),
      endhour: new Date(`${startDate}T${endHour}`),
      reserv__id: this.reservdata.reserv__id,
    };
    console.log('<>><<>><><><><<>', fetchSalleData);
    this.fetchSalles(fetchSalleData);
  }

  fetchSalles(fetchSalleData: {
    starthour: Date;
    endhour: Date;
    reserv__id: any;
  }): void {
    this.salleService.getSalleSpecific(fetchSalleData).subscribe(
      (data) => {
        this.salles = data;
        console.log('<>><<>><><><><<>', data);
      },
      (error) => {
        console.error('Error fetching salles', error);
      }
    );
  }
  GetAllSalles(): void {
    this.salleService.getSalles().subscribe(
      (data) => {
        this.AllSalles = data;
        console.log('GetAllSalles', data);
      },
      (error) => {
        console.error('Error fetching salles', error);
      }
    );
  }
  getNamesalle(salle__id: any) {
    const selectedSalle = this.AllSalles.find(
      (salle: { salle__id: any }) => salle.salle__id == salle__id
    );
    return selectedSalle ? selectedSalle.salle__name : '';
  }

  futureDateValidator() {
    const selectedDate = this.eventForm.get('startDate')?.value;

    const selectedDateObj = new Date(selectedDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the current date to midnight for comparison

    const year = currentDate.getFullYear();
    const month = Number(currentDate.getMonth() + 1);
    const day = Number(currentDate.getDate());

    const year1 = selectedDateObj.getFullYear();
    const month1 = Number(selectedDateObj.getMonth() + 1);
    const day1 = Number(selectedDateObj.getDate());
    const c = year + month + day;
    const S = year1 + month1 + day1;

    if (year > year1) {
      console.log('true year');
      return true; // Return an error object if the selected date is not in the future
    } else if (year == year1 && month > month1) {
      console.log('true month');
      return true; // Return an error object if the selected date is not in the future
    } else if (year == year1 && month == month1 && day > day1) {
      console.log('true day');
      return true;
    }
    return false;
  }
  controlTime(): void {
    const start = this.eventForm.get('startTime')?.value;
    let end = this.eventForm.get('endTime')?.value;

    if (!start || !end) {
      console.log('Start time or End time is not set');
      return;
    }

    // Parse start time and add 15 minutes
    const [startHours, startMinutes] = start.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes + 15, 0, 0);

    // Parse end time
    const [endHours, endMinutes] = end.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);

    console.log('Start time + 15 minutes:', startDate);
    console.log('End time:', endDate);

    if (startDate < endDate) {
      console.log('End time is valid.');
    } else {
      console.log(
        'End time must be at least 15 minutes after start time.',
        this.eventForm.controls['endTime']
      );
      this.eventForm.get('endTime')?.setErrors({
        endTimeInvalid:
          'The end time must be at least 15 minutes greater than the start time',
      });
    }
  }

  updatePlan(rowData: any) {
    console.log('rowData is ', rowData);
    this.updatecalendar = true;
    const startDate = new Date(rowData.startDate);
    const endDate = new Date(rowData.endDate);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedStartTime = startDate
      .toTimeString()
      .split(' ')[0]
      .slice(0, 5); // HH:MM format
    const formattedEndTime = endDate.toTimeString().split(' ')[0].slice(0, 5); // HH:MM format
    this.eventForm = this.fb.group({
      title: [rowData.exam__title],
      startDate: [formattedStartDate],
      startTime: [formattedStartTime],
      endTime: [formattedEndTime],
      salle: [rowData.salle],
      group: [rowData.group__name],
    });

    this.reservdata = rowData;
  }

  isUpdate() {
    const formValues = this.eventForm.value;
    const calandarData = {
      startDate: new Date(`${formValues.startDate}T${formValues.startTime}`),
      endDate: new Date(`${formValues.startDate}T${formValues.endTime}`),
      id: this.reservdata.reserv__id,
      group__name: formValues.group.group__name,
      salle: formValues.salle,
      exam__title: formValues.title,
    };

    console.log('calandarData', calandarData);
    console.log('reservdata', this.reservdata);
    const reservStartDate = new Date(this.reservdata.startDate);
    const reservEndDate = new Date(this.reservdata.endDate);

    if (
      calandarData.startDate.getTime() === reservStartDate.getTime() &&
      calandarData.endDate.getTime() === reservEndDate.getTime() &&
      calandarData.salle === this.reservdata.salle
    ) {
      return false;
    }
    return true;
  }
  deleteplan(id: any, op: OverlayPanel) {
    this.calandarService.deletePlan(id).subscribe(
      (response: any) => {
        if (this.examShudeled.reservation.length == 1) {
          op.hide();
        }
        this.examShudeled.reservation = this.examShudeled.reservation.filter(
          (Plan: { reserv__id: any }) => Plan.reserv__id !== id
        );
        const index = this.Exams.findIndex(
          (exam) => exam.exam__id === this.examShudeled.exam__id
        );
        this.Exams[index] = this.examShudeled;

        alert('Successfully update');
        console.log('seccess update', response);

        // window.location.reload();
      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
      }
    );
  }
  saveplan() {
    console.log('event form is ', this.eventForm);
    this.controlTime();
    if (this.futureDateValidator()) {
      return;
    } else {
      if (this.eventForm.valid) {
        console.log('987654', this.futureDateValidator());
        const formValues = this.eventForm.value;
        const calandarData = {
          startDate: new Date(
            `${formValues.startDate}T${formValues.startTime}`
          ),
          endDate: new Date(`${formValues.startDate}T${formValues.endTime}`),
          id: this.reservdata.reserv__id,
          group__name: formValues.group.group__name,
          salle: formValues.salle,
          exam__title: formValues.title,
        };

        this.calandarService.updatereservation(calandarData).subscribe(
          (response: any) => {
            const index = this.Exams.findIndex(
              (exam) => exam.exam__id === response.exam__id
            );
            // this.Exams.reservation.findIndex(exam => exam.exam__id === response.exam__id);
            const indexR = this.Exams[index].reservation.findIndex(
              (reserv) => reserv.reserv__id === response.reserv__id
            );

            console.log(
              ' this.Exams[index].reservation[indexR]',
              this.Exams[index].reservation[indexR]
            );

            this.Exams[index].reservation[indexR] = response;
            console.log(
              ' this.Exams[index].reservation[indexR]',
              this.Exams[index].reservation[indexR]
            );
            this.updatecalendar = false;
            alert('Successfully update');
            console.log('seccess update', response);

            // window.location.reload();
          },
          (error: { error: { message: any } }) => {
            console.log('errrr', error);
          }
        );
      }
    }
  }

  showDialog(id: any) {
    this.visible = true;

    console.log('hddhdhdhdhdhdh', id);
    if (!this.Exam) {
      this.fetchExam(id);
    } else if (this.Exam.exam__id != id) {
      this.fetchExam(id);
    }
  }

  ngOnInit() {
    this.GetAllSalles();
    this.eventForm = this.fb.group({
      title: [''],

      startDate: [''],
      startTime: [''],
      endTime: [
        '',
        Validators.required,
        endTimeValidator('startTime', 'endTime'),
      ],
      salle: [''],
      group: [''],
    });
    this.deleteform = {
      id: '',
      name: '',
      type: '',
    };

    this.teacherService.getTecher(this.user__id).subscribe(
      (data: Teacher[]) => {
        const teacher = data;

        this.group = teacher[0].groups;

        console.log('subjectshhhhhhsss is is sis', teacher[0]);
      },
      (error) => {
        console.error('Error fetching subjects', error);
      }
    );

    this.fetchExams();
  }
  listPlan(exam: any, op: OverlayPanel) {
    op.toggle(event);
    this.examShudeled = exam;

    console.log('is examShudeled', this.examShudeled);
  }
  overpanelClose(op: any) {
    op.hide();
  }
  toggleCalendar(exam: any, op: OverlayPanel) {
    op.hide();
    this.showCalendar = !this.showCalendar;
    this.examPlan = exam;
    this.firstDate = '';
    if (exam.reservation) {
      if (exam.reservation.length > 0) {
        this.firstDate = exam.reservation[0].startDate;
      }
    }
  }

  isMonthView!: boolean;
  onIsMonthViewChange(value: boolean) {
    this.isMonthView = value;
  }

  onupdatePlan(value: boolean) {
    this.examShudeled.reservation.push(value);
    const index = this.Exams.findIndex(
      (exam) => exam.exam__id === this.examShudeled.exam__id
    );

    console.log(
      'this.Exams 1this.Exams value this.Exams : .',
      this.examShudeled
    );
    this.Exams[index] = this.examShudeled;
    console.log(
      'this.Exams this.Exams this.Exams this.Exams 22: .',
      this.Exams[index]
    );
    console.log(' valuevalue: .', value);
  }

  getSpeedDialItems(exam: any) {
    return [
      {
        icon: 'pi pi-pencil',
        command: () => {
          console.log('Edit exam with id:', exam.exam__id);
          this.showDialog(exam.exam__id);
        },
      },
      {
        icon: 'pi pi-trash',
        disabled: exam.answers.length > 0,
        command: () => {
          console.log('Refresh exam with id:', exam.exam__id);
          this.toggleDelete(exam, exam.exam__id, 'exam');
          console.log('deletexam is :', this.deletexam);
        },
      },
    ];
  }

  get reponsesControls() {
    return (this.questionForms.get('reponses') as FormArray).controls;
  }
  initializeUpdateForms(question: any): void {
    this.id_question = question.question__id;
    const reponsesArray = this.fb.array(
      question.reponses.map(
        (reponse: {
          reponse__statut: any;
          reponse__text: any;
          reponse__id: number;
        }) =>
          this.fb.group({
            reponse__id: [reponse.reponse__id],
            reponse__statut: [reponse.reponse__statut],
            reponse__text: [
              reponse.reponse__text,
              [
                Validators.required,
                Validators.pattern(GlobalConstants.nameRegex),
              ],
            ],
          })
      )
    );

    this.questionForms = this.fb.group({
      note: [question.note, [Validators.required, rangeNumber(0, 20)]],
      question__text: [
        question.question__text,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      question__type: [question.question__type,[Validators.required]],
      reponses: reponsesArray,
    });

    this.QuestionUpdate = this.questionForms.value;
  }
  initializeAddForms(questionType: string): void {
    const reponsesArray = this.fb.array([
      this.fb.group({
        reponse__statut: [false],
        reponse__text: [
          '',
          [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
        ],
      }),
    ]);

    this.questionForms = this.fb.group({
      exam__id: [this.Exam.exam__id],
      note: ['', [Validators.required, rangeNumber(0, 20)]],
      question__text: [
        '',
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      question__subject: [this.Exam.subject],
      question__type: ['',[Validators.required]],
      reponses: this.fb.array([])
    });
  }

  changeType(type:string){
    this.questionForms.get('question__type')?.valueChanges.subscribe(value => {
      
        this.initializeReponsesArray(type);
     
    });
  }

  initializeReponsesArray(type:string) {
    const reponsesArray = this.questionForms.get('reponses') as FormArray;
    reponsesArray.clear();
    if (type === 'QCM') {
      reponsesArray.push(this.createReponse());
      reponsesArray.push(this.createReponse());
    }
   
  
  }

  createReponse(): FormGroup {
    return this.fb.group({
      reponse__text: ['', Validators.required],
      reponse__statut: [false]
    });
  }
  addReponse(): void {
    const reponses = this.questionForms.get('reponses') as FormArray;
    reponses.push(
      this.fb.group({
        reponse__statut: [false],
        reponse__text: [
          '',
          [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
        ],
      })
    );
  }
  deleteReponse(index: number): void {
    const reponses = this.questionForms.get('reponses') as FormArray;
    reponses.removeAt(index);
  }
  editQuestion(question: any) {
    this.initializeUpdateForms(question);
    this.questionFile = [];
    console.log('ssssssssssssssss', question.fileQuestion);
    if (question.fileQuestion && Array.isArray(question.fileQuestion)) {
      question.fileQuestion.forEach((file: any) => {
        if (file) {
          const extension = getFileExtension(file.file__name);
          const fileType = getFileType(extension);
          this.questionFile.push({
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
    console.log('filequestttt', this.questionFile);

    console.log('QuestFileInitialEdit', this.QuestFileInitialEdit);
    this.update = true;
  }

  async detectFiles(event: any,type:string) {
    let files = event.target.files;
    const filesArray = Array.from(files);
    let existingFileNames =[]
if(type==='exam'){
  existingFileNames = this.Exam.fileExam.map((file: { file__name: any; }) => file.file__name);
  
}else{
  existingFileNames = this.questionFile.map((file: { name: any; }) => file.name);

}
    
    const filteredFiles = filesArray.filter((file:any) => !existingFileNames.includes(file.name));
    console.log("filtredFIle",filteredFiles)
    console.log("filesArray",filesArray)
    files = filteredFiles
    if (files) {
      for (let file of files) {
        this.Fileupload.push(file);
        const extension = getFileExtension(file.name);
        const fileType = getFileType(extension);

        await this.readFileAsync(file).then((url: any) => {
          this.FileAdds.push({ name: file.name, type: fileType, url: url });
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
    this.FileAdds.splice(index, 1);
    this.Fileupload.splice(index, 1);
  }
  deleteFile(fileid: number, index: number) {
    this.questionFile.splice(index, 1);
    this.fileIds.push(fileid);

    console.log('fileIds is ::::>', this.fileIds);
  }
  deleteFileExam(fileid: number, index: number) {
    this.Exam.fileExam.splice(index, 1);
    this.fileIds.push(fileid);

    console.log('fileIds is ::::>', this.fileIds);
  }
  addQuestion(questionType: string) {
    this.initializeAddForms(questionType);
    this.questionFile = [];


    this.add = true;
  }
  closeQuest() {
    this.add = false;
    this.update = false;
  }

  checkUpdate(Type : string): boolean {

    if(Type === 'exam'){
      
    return (
      this.fileIds.length > 0  ||
      this.Fileupload.length > 0
    );
    }else{
    return (
      JSON.stringify(this.QuestionUpdate) !==
        JSON.stringify(this.questionForms.value) ||
      JSON.stringify(this.QuestFileInitialEdit) !==
        JSON.stringify(this.questionFile) ||
      this.Fileupload.length > 0
    );

    }







  }
  saveExamUpdate() {
    console.log('Fileupload', this.Fileupload);
    console.log('fileExamInit', this.fileExamInit);
    console.log('fileIds', this.fileIds);
    console.log('this.Exam.fileExam)', this.Exam.fileExam);

    this.dataExam = {
     
      files: this.Fileupload,
    };


    const model = 'exam';
this.examService.UpdateFileExam(this.Exam.exam__id, this.dataExam).subscribe(
  (response: any) => {


    this.fileIds.forEach((id: any) => {
      if (id) {
        console.log('fiiiid', id);
        this.questService.deleteFiles(id, model).subscribe(
          (response: any) => {},
          (error: { error: { message: any } }) => {
            console.log('error', error);
          }
        );
      }
    });
    this.fileIds=[]
    this.FileAdds=[]
    this.Fileupload=[]
    this.fetchExam(this.Exam.exam__id);
    alert('Successfully updated');
    console.log('succ112@@111111111111111113ess', response);

  },
  (error: { error: { message: any } }) => {
    console.log('error', error);
  }
);
   


  }
  saveQuestion(): void {
    Object.values(this.questionForms.controls).forEach((control) => {
      control.markAsTouched();
    });

    // Get the reponses FormArray
    const reponsesArray = this.questionForms.get('reponses') as FormArray;

    // Mark each control within the reponses FormArray as touched
    reponsesArray.controls.forEach((control: AbstractControl) => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach((innerControl) => {
          innerControl.markAsTouched();
        });
      }
    });
    if (!this.questionForms.valid || !reponsesArray.valid) {
      console.log('is not valid ', this.questionForms.value);
      return;
    }

    const hasEmptyReponseText = reponsesArray.controls.some(
      (control: AbstractControl) => {
        const reponseText = control.get('reponse__text')?.value;
        return reponseText === '';
      }
    );

    if (hasEmptyReponseText) {
      console.log('There are responses with empty text fields');
      return;
    }
    this.dataquest = {
      question: this.questionForms.value,
      files: this.Fileupload,
    };
    if (this.update && !this.add) {
      const model = 'question';

      if (
        JSON.stringify(this.QuestionUpdate) ===
          JSON.stringify(this.questionForms.value) &&
        JSON.stringify(this.QuestFileInitialEdit) ===
          JSON.stringify(this.questionFile)
      ) {
        console.log(
          'No update, the form values are the same.',
          JSON.stringify(this.QuestionUpdate) ===
            JSON.stringify(this.questionForms.value) &&
            JSON.stringify(this.QuestFileInitialEdit) ===
              JSON.stringify(this.questionFile)
        );

       
        return;
      }

      this.questService
        .updateQuestion(this.dataquest, this.id_question)
        .subscribe(
          (response: any) => {
            this.fileIds.forEach((id: any) => {
              if (id) {
                console.log('fiiiid', id);
                this.questService.deleteFiles(id, model).subscribe(
                  (response: any) => {},
                  (error: { error: { message: any } }) => {
                    console.log('error', error);
                  }
                );
              }
            });
            this.fileIds=[]
            this.FileAdds=[]
            this.Fileupload=[]
            this.fetchExam(this.Exam.exam__id);
            this.closeQuest();
            alert('Successfully updated');
            console.log('success', response);
          },
          (error: { error: { message: any } }) => {
            console.log('error', error);
          }
        );
    } else if (!this.update && this.add) {
      this.questService.createquestion(this.dataquest).subscribe(
        (response: any) => {
          this.fileIds=[]
          this.FileAdds=[]
          this.Fileupload=[]

          this.fetchExam(this.Exam.exam__id);
          alert('Successfully create');
          console.log('seccess', response);
          this.closeQuest();
        },
        (error: { error: { message: any } }) => {
          console.log('errrr', error);
        }
      );
    }

    console.log(this.Fileupload);
    console.log(this.dataquest);
  }

  typeFile(file: any): any {
    const extension = getFileExtension(file.file__name);
    const fileType = getFileType(extension);
    // console.log("type file is",fileType)
    // console.log("type  is",file.file__type)
    return { name: file.name, type: fileType };
  }
  openFile(filePath: string): void {
    window.open(filePath, '_blank');
  }

  checkAnswer(reponse: any) {
    let styles = {
      color: 'black',
    };
    let iconClass = 'fa-solid fa-window-minimize';
    // console.log("gggggg",question)
    // console.log("kkkkk",this.studentAnswer)

    // console.log("ooooo",ans.Answer__text)
    // console.log("quest", reponse )

    if (reponse.reponse__statut === true) {
      styles = {
        color: 'green',
      };
      iconClass = 'fa-solid fa-check';
    }

    return { styles, iconClass };
  }

  fetchExam(id: any): void {
    this.groupedQuestions = {};
    this.examService.getExamByid(id).subscribe(
      (data) => {
        this.Exam = data;
        this.groupQuestionsByType();
        console.log(' <div *ngIf="f.file__type === ', this.Exam);
        this.examType = this.Exam.exam__type;
        this.examdesc= this.Exam.exam__desc
        this.oblig=this.Exam.obligatoire
        this.idExamSup = this.Exam.exam__id
        if (this.Exam.fileExam && this.Exam.fileExam.length > 0) {
          for (const f of this.Exam.fileExam) {
            console.log("ffffffff", f);
            this.fileExamInit.push(f);
            
          }
        }
        // this.fileExamInit = this.Exam.fileExam
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
    console.log('grouuuuped', this.groupedQuestions);
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

  fetchExams(): void {
    this.examService.getTeacherExam(this.user__id).subscribe(
      (data: Exam[]) => {
        console.log('Response from backend:', data);
        this.Exams = data;
        console.log('exams iss:', this.Exams);
      },
      (error: any) => {
        console.error('Error fetching groups', error);
      }
    );
  }

  deleteObj(id: any, action: string ) {
    const exam__id = id;
    console.log('examid is ', exam__id);
    if (this.deleteform.type === 'exam') {
      this.examService.deleteExam(exam__id).subscribe(
        (response) => {
          console.log('Response delete Exam :', response);
          this.Exams = this.Exams.filter((exam) => exam.exam__id !== id);
          this.deletexam = false

        },
        (error: any) => {
          console.error('Error fetching groups', error);
        }
      );
    } else {
      const model = {
        exam__id: this.Exam.exam__id,
        action: action,
      };

      this.questService.deleteQuestion(id, model).subscribe(
        (response) => {
          console.log('Response from backend:', response);
          console.log('RgroupedQuestionsgroupedQuestions', this.deleteform.QType);
          this.Exam.questions = this.Exam.questions.filter((quest: { question__id: any; }) => quest.question__id !== id);
          this.groupedQuestions[this.deleteform.QType] =  this.groupedQuestions[this.deleteform.QType].filter((quest: { question__id: any; }) => quest.question__id !== id);
          
          this.deletexam = false

        },
        (error: any) => {
          console.error('Error fetching groups', error);
        }
      );
      console.log('delete ', this.deleteform.type);
      console.log('delete ', this.deleteid);
    }
    this.deletexam = false;
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: { first: number; rows: number }) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.Exams ? this.first === this.Exams.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.Exams ? this.first === 0 : true;
  }

  async openupdateSupport(exam:any){
    this.supportUp = true
    this.idExamSup= exam.exam__id
    this.urlsSuport=[]
    const files = exam.file .filter( (f: any) =>
      f.file__type ==='support'
  );
  console.log("klsdhbsdgb hdsbd hdbd ",files)
  this.existsuportFile=[]
  this.IdsSuport = [];
if(files){
  for (let file of files) {
    // this.listsuportFile.push(file);
 
    const extension = getFileExtension(file.file__name);
    const fileType = getFileType(extension);
    this.existsuportFile.push({ name: file.file__name, type: fileType, url: file.file__path ,fileId : file.file__id});
    // await this.readFileAsync(file).then((url: any) => {
    //   this.existsuportFile.push({ name: file.file__name, type: fileType, url: url ,fileId : file.file__id});
    // });
  }
  }


  }

toggleUpdate(){
  this.supEdit=true
}
  deleteSupFile(index: number, id:any) {
    this.existsuportFile.splice(index, 1);
    this.IdsSuport.push(id);
  }


  removeSupFile(index: number) {
    this.urlsSuport.splice(index, 1);
    this.listsuportFile.splice(index, 1);
  }

  async detectFilesSupport(event: any) {
    let files = event.target.files;
    this.listsuportFile = [];
    this.urlsSuport = [];

    if (files) {
      for (let file of files) {
        this.listsuportFile.push(file);
     
        const extension = getFileExtension(file.name);
        const fileType = getFileType(extension);

        await this.readFileAsync(file).then((url: any) => {
          this.urlsSuport.push({ name: file.name, type: fileType, url: url });
        });
      }
    }
  }


  AddSupport() {

    
   
    
    if(this.examdesc!=='' || this.listsuportFile.length > 0 || this.IdsSuport.length > 0 ){
    

    
        const data = {
          exam__desc: this.examdesc,
        };
    
        const datasupport = {
          exam: data,
          files: this.listsuportFile,
        };
        const model = "exam"
        console.log('datasupportdatasupport datasupport', datasupport);
        this.examService.AddDescSupport(datasupport, this.idExamSup).subscribe(
          (response: any) => {
            console.log('Exams Desc',this.idExamSup, this.Exams);

            const index = this.Exams.findIndex(
              
              (exam) => exam.exam__id === this.idExamSup
            );
            console.log('Exams Desc',this.idExamSup,index);
if (this.IdsSuport.length > 0){


            this.IdsSuport.forEach((id: any) => {
              if (id) {
                console.log('fiiiid', id);
                this.questService.deleteFiles(id, model).subscribe(
                  (response: any) => {

                    console.log("abs",this.Exams[index],"jhlh/n",response)
                    this.Exams[index] = response;

                  },
                  (error: { error: { message: any } }) => {
                    console.log('error', error);
                  }
                );
              }
            });}else{
              console.log("abs",this.Exams[index],"lk fals")
              this.Exams[index] = response;
            }



            console.log("this.Exams[index]this.Exams[index]",this.Exams[index])
            this.supEdit=false
            this.IdsSuport=[]
            this.supportUp = false
            this.listsuportFile = [];
            this.urlsSuport = [];
            this.existsuportFile= [];
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
     }else{
      console.log('is nos support');
      
     }
     }
    






}
