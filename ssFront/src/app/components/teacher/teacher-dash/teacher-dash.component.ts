import { Component } from '@angular/core';

import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { GroupService } from '../../../services/servicesUtils/group.service';
import { TeacherService } from '../../../services/serviceTeacher/teacher.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../services/servicesUser/user.service';
import { GlobalConstants } from '../../../shared/global-constants';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { CalandarService } from '../../../services/serviceTeacher/calandar.service';
import { DialogModule } from 'primeng/dialog';
import { SubscribeService } from '../../../services/servicesUtils/subscribe.service';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

interface Teacher {
  first__name: string;
  last__name: string;

  user__email: string;
  img__path: string;

  subjects: [];
  groups: [];
  exam: any[];
}
@Component({
  selector: 'app-teacher-dash',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    FormsModule,
    MultiSelectModule,
    DialogModule,
  ],
  templateUrl: './teacher-dash.component.html',
  styleUrl: './teacher-dash.component.css',
  styles: [
    `
      :host ::ng-deep .p-dialog-content {
        overflow-y: visible !important;
      }
    `,
  ],
})
export class TeacherDashComponent {
  user__id = this.tokenService.getUserIdFromToken();
  group__id = this.tokenService.getGroupIdFromToken();
  group: any;
  students: any[] = [];
  subjectsArray: any[] = [];
  schudles: any[] = [];
  exams: any[] = [];
  teacher!: Teacher;
  imgProfil: any;
  imgUp: any;
  updateimg: boolean = false;
  results: any[] = [];
  visible: boolean = false;
  dataStudent: any;
  StudentOptions: any;
  selectedEmails: any[] = [];
  schedule: any;

  constructor(
    private groupService: GroupService,
    private tokenService: TokenServiceService,
    private teacherService: TeacherService,

    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private calandarService: CalandarService,
    private subscribeService: SubscribeService
  ) {}

  ngOnInit(): void {
    this.fetchTeacher();
  }

  showCode(data: any) {
    this.schedule = data;
  
    if (this.schedule.exam.obligatoire == true) {
      this.fetchIngroup(this.schedule.group__name);
    } else {
      this.subscribeService.subscribeExam(this.schedule.exam__id).subscribe(
        (data: any) => {
          this.students = [];
          this.selectedEmails = [];
          for (const sub of data) {
            console.log('sup k', sub);
            this.students.push(sub.student);
          }

          console.log('students subs', this.students);
        },
        (error: any) => {
          console.error('Error fetching exam', error);
        }
      );
    }

    console.log('shusdele ids heure', this.schedule);
    this.visible = true;
  }



  loadFile(event: any) {}
  async detectFilesSupport(event: any) {
    let files = event.target.files;

    if (files) {
      for (let file of files) {
        this.imgUp = file;
        this.updateimg = true;
        await this.readFileAsync(file).then((url: any) => {
          this.imgProfil = url;
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

  fetchIngroup(name: any): void {
    this.groupService.getGroupbyName(name).subscribe(
      (data: any) => {
        this.students = [];
        this.selectedEmails = [];

        this.students = data.students;

        console.log('students group', this.students);
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }

  fetchexams(): void {
    this.calandarService.getSchedule(this.exams).subscribe(
      (data: any) => {
        this.schudles = data;
        console.log('fetchexams fetchexams fetchexams resfetchexamsults', data);
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }
  sendCode() {
    console.log('emails is', this.selectedEmails);

    // Initialize an empty array to store email addresses
    let emails = [];

    // Loop through selectedEmails to extract the email addresses
    for (const email of this.selectedEmails) {
      emails.push(email.user__email);
    }

    // Create a data object to send in the request
    let data = {
      exam__title: this.schedule.exam__title,
      code: this.schedule.code,
      emails: emails,
    };

    // Call the sendCodeExam method of calandarService and handle the response
    this.calandarService.sendCodeExam(data).subscribe(
      (response: any) => {
        console.log('Fetch exams results:', response);

        this.visible = false;

      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }

  fetchTeacher(): void {
    this.teacherService.getTecher(this.user__id).subscribe(
      (data: any) => {
        this.teacher = data[0];
        this.group = this.teacher.groups;
        this.subjectsArray = this.teacher.subjects;

        for (const exam of this.teacher.exam) {
          this.exams.push(exam.exam__id);
        }
        this.fetchexams();

        console.log('teacher', this.teacher);
        console.log('subjectsArray', this.subjectsArray);
        console.log('group', this.group);
        this.imgProfil = this.teacher.img__path;
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }

  // formateData(): void {
  //   // Add a property 'answers' to each exam in the group to hold the related answers

  //   for (const sub of this.group.subjects) {
  //     let count = 0;
  //     let i = 0;

  //     if (this.group.exams.length > 0) {
  //       for (const exam of this.group.exams) {

  //         if (exam.subject === sub.subject__name) {
  //           count = count + 1;
  //           if (exam.answers.length > 0) {
  //             for (const ans of exam.answers) {
  //               if(ans.student__id == this.user__id){
  //                 i = i + 1;

  //               }

  //             }
  //           }
  //         }
  //       }
  //     }
  //     let formdata = {
  //       subject: sub.subject__name,
  //      nb__exam : count,
  //      nb__examDone: i,
  //      teacher:sub.teacher
  //     };

  //     this.subjectsArray.push(formdata)

  //   }
  //   console.log('my formated with subjects',);

  //   // Optional: Print out the formatted data for debugging
  //   // console.log('Formatted group data', this.group);
  // }

  savePdp(): void {
    const file = this.imgUp;

    this.teacherService.updatePicture(file, this.user__id).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        console.log('responseresponse :', response.message);

        this.updateimg = false;
      },
      (error: any) => {
        if (error.error?.message) {
          this.messageService.add({
            severity: 'danger',
            summary: 'Failed',
            detail: error.error?.message,
          });
        } else {
          this.messageService.add({
            severity: 'danger',
            summary: 'Failed',
            detail: GlobalConstants.genericError,
          });
        }

        console.error('Error fetching exam', error);
      }
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }

  SendMail() {
    const data = {
      user__email: this.teacher.user__email,
    };
    this.userService.forgotPassword(data).subscribe(
      (response: any) => {
        this.logout();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });

        console.log('seccess', response);
      },
      (error: { error: { message: any } }) => {
        //this.ngxService.stop();
        if (error.error?.message) {
          this.messageService.add({
            severity: 'danger',
            summary: 'Failed',
            detail: error.error?.message,
          });
        } else {
          this.messageService.add({
            severity: 'danger',
            summary: 'Failed',
            detail: GlobalConstants.genericError,
          });
        }
        // alert(this.responseMessage +" " +GlobalConstants.error);
      }
    );
  }
}
