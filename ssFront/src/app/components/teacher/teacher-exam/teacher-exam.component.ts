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
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { QuestionService } from '../../../services/serviceTeacher/question.service';
export interface Exam {
  subject: string;
  exam__type: string;
  // Add other properties if needed
}
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CalandarService } from '../../../services/serviceTeacher/calandar.service';
import { SalleService } from '../../servicesUtils/salle.service';
import { CalandarfullComponent } from '../../calandarfull/calandarfull.component';
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
  ],
})
export class TeacherExamComponent {
  [x: string]: any;
  Exams: Exam[] = [];
  items: MenuItem[] | null = null;
  first = 0;
  id_question!: number;
  rows = 10;
  Exam: any;
  examType: any;
  groupedQuestions: { [key: string]: any[] } = {};
  examShudeled: any;
  visible: boolean = false;
  fileIds: any[] = [];
  questionForms: FormGroup;
  isEditing: boolean = false;
  dataquest!: { question: any; files: any };
  questionFile: any = [];
  FileAdds: any = [];
  Fileupload: any = [];
  examPlan: any;
  firstDate: any;
  updatecalendar: boolean = false;
  eventForm!: FormGroup;
  salles: any;
  reservdata: any;
  deleteid: any;
  deleteform: any;
  deletexam: boolean = false;
  showCalendar: boolean = false;
  constructor(
    private examService: ExamService,
    private salleService: SalleService,
    private questService: QuestionService,
    private fb: FormBuilder,
    private calandarService: CalandarService
  ) {
    this.questionForms = this.fb.group({
      note: [''],
      question__text: '',
      reponses: this.fb.array([]),
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

    const fetchSalleData = {
      starthour: new Date(`${startDate}T${startHour}`),
      endhour: new Date(`${startDate}T${endHour}`),
      exam__id: this.reservdata.exam__id,
    };
    console.log('<>><<>><><><><<>', fetchSalleData);
    this.fetchSalles(fetchSalleData);
  }

  fetchSalles(fetchSalleData: {
    starthour: Date;
    endhour: Date;
    exam__id: any;
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
  saveplan() {
    console.log('event form is ', this.eventForm);

    const formValues = this.eventForm.value;
    const calandarData = {
      startDate: new Date(`${formValues.startDate}T${formValues.startTime}`),
      endDate: new Date(`${formValues.startDate}T${formValues.endTime}`),
      id: this.reservdata.reserv__id,
      group__name: formValues.group.group__name,
      salle: formValues.salle,
      exam__title: formValues.title,
    };
    console.log(
      'beforzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzze',
      calandarData
    );

    this.calandarService.updatereservation(calandarData).subscribe(
      (response: any) => {
        alert('Successfully create');
        console.log('seccess create', response);

        // window.location.reload();
      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
      }
    );
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
    this.eventForm = this.fb.group({
      title: [''],

      startDate: [''],
      startTime: [''],
      endTime: [''],
      salle: [''],
      group: [''],
    });
    this.deleteform = {
      id: '',
      name: '',
      type: '',
    };

    this.fetchGroups();
    console.log('><><><><><><><><><><><', this.Exams);
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

  isMonthView: boolean = true;
  onIsMonthViewChange(value: boolean) {
    this.isMonthView = value;
    console.log('vvvvvvvvvvvvvvvvvv: .', this.isMonthView);
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
            reponse__text: [reponse.reponse__text],
          })
      )
    );

    this.questionForms = this.fb.group({
      note: [question.note],
      question__text: [question.question__text],
      reponses: reponsesArray,
    });
  }
  initializeAddForms(questionType: string): void {
    const reponsesArray = this.fb.array([
      this.fb.group({
        reponse__statut: [false],
        reponse__text: [''],
      }),
    ]);

    this.questionForms = this.fb.group({
      exam__id: [this.Exam.exam__id],
      note: [''],
      question__text: [''],
      question__subject: [this.Exam.subject],
      question__type: [questionType],
      reponses: reponsesArray,
    });
  }
  addReponse(): void {
    const reponses = this.questionForms.get('reponses') as FormArray;
    reponses.push(
      this.fb.group({
        reponse__statut: [false],
        reponse__text: [''],
      })
    );
  }
  deleteReponse(index: number): void {
    const reponses = this.questionForms.get('reponses') as FormArray;
    reponses.removeAt(index);
  }
  editQuestion(question: any) {
    this.initializeUpdateForms(question);
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
        }
      });
    }

    console.log('filequestttt', this.questionFile);
    this.update = true;
  }

  async detectFiles(event: any) {
    let files = event.target.files;

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

  addQuestion(questionType: string) {
    this.initializeAddForms(questionType);
    this.add = true;
  }
  closeQuest() {
    this.add = false;
    this.update = false;
  }
  saveQuestion(): void {
    this.dataquest = {
      question: this.questionForms.value,
      files: this.Fileupload,
    };
    if (this.update && !this.add) {
      const model = 'question';
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
            this.fetchExam(this.Exam.exam__id);

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
          alert('Successfully create');
          console.log('seccess', response);
        },
        (error: { error: { message: any } }) => {
          console.log('errrr', error);
        }
      );
    }

    console.log(this.Fileupload);
    console.log(this.dataquest);
    this.closeQuest();
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
        console.log('datataken', this.Exam);
        this.examType = this.Exam.exam__type;
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

  fetchGroups(): void {
    this.examService.getTeacherExam().subscribe(
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

  deleteObj(id: any, action: string) {
    const exam__id = id;
    console.log('examid is ', exam__id);
    if (this.deleteform.type === 'exam') {
      this.examService.deleteExam(exam__id).subscribe(
        (data) => {
          console.log('Response from backend:', data);
        },
        (error: any) => {
          console.error('Error fetching groups', error);
        }
      );
    } else {
      const model = {
        exam__id: exam__id,
        action: action,
      };

      this.questService.deleteQuestion(id, model).subscribe(
        (data) => {
          console.log('Response from backend:', data);
        },
        (error: any) => {
          console.error('Error fetching groups', error);
        }
      );
      console.log('delete ', this.deleteform.type);
      console.log('delete ', this.deleteid);
    }
    this.deletexam =false
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
}
