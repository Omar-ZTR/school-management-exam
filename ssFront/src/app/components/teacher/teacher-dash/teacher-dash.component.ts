import { Component } from '@angular/core';
import { ExamAnswersService } from '../../../services/serviceAnswers/exam-answers.service';
import { StudentService } from '../../../services/serviceStudent/student.service';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { GroupService } from '../../../services/servicesUtils/group.service';
import { TeacherService } from '../../../services/serviceTeacher/teacher.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../services/servicesUser/user.service';
import { GlobalConstants } from '../../../shared/global-constants';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

interface Teacher {
  first__name: string;
  last__name: string;

  user__email: string;
  img__path: string;

  subjects: [];
  groups: [];
  exam: [];
}
@Component({
  selector: 'app-teacher-dash',
  standalone: true,
  imports: [CommonModule,TooltipModule],
  templateUrl: './teacher-dash.component.html',
  styleUrl: './teacher-dash.component.css',
})
export class TeacherDashComponent {
  user__id = this.tokenService.getUserIdFromToken();
  group__id = this.tokenService.getGroupIdFromToken();
  group: any[] = []
  subjectsArray: any[] = [];
  teacher!:Teacher;
  imgProfil: any ;
  imgUp: any;
  updateimg: boolean = false;
  results: any[] = [];

  dataStudent: any;
  StudentOptions: any;

  constructor(
    private groupService: GroupService,
    private tokenService: TokenServiceService,
    private teacherService: TeacherService,
    private AnswersService: ExamAnswersService,
    private userService: UserService,
    private messageService : MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchTeacher();
    // this.fetchIngroup();
    // this.fetchAnswers()
  }
  // generateAcceptationCharts() {
  //   const accept = this.studentsAccept.length;
  //   const refused = this.studentsRefused.length;
  //   const wait = this.studentsWait.length;

  //   this.dataStudent = {
  //     labels: [`Accepted ${accept}`, `Refused ${refused}`, `waiting ${wait}`],
  //     datasets: [
  //       {
  //         data: [accept, refused, wait],
  //         backgroundColor: ['#039e31', '#ff0000', '#f97316'],
  //         hoverBackgroundColor: ['#039e31', '#ff0000', '#f97316'],
  //       },
  //     ],
  //   };

  //   this.StudentOptions = {
  //     cutout: '60%',
  //     plugins: {
  //       legend: {
  //         labels: {
  //           usePointStyle: true,
  //           color: '#09782c',
  //           font: {
  //             size: 14, // Set the font size
  //             style: 'italic', // Set the font style
  //             family: 'Arial', // Set the font family
  //           },
  //           padding: 20, // Set padding between legend items
  //           boxWidth: 20, // Set the box width
  //         },
  //       },
  //     },
  //   };
  // }
  fetchAnswers(): void {
    this.AnswersService.getStudentAnswer(this.user__id).subscribe(
      (data: any) => {
        this.results = data.filter(
          (answer: { ans_result: any; exam__oblig: boolean }) =>
            answer.ans_result > 15 && answer.exam__oblig !== true
        );
        // this.groupQuestionsByType();

        console.log('results datataken results results', this.results);
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
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

  // fetchIngroup(): void {
  //   this.groupService.getoneGroup(this.group__id).subscribe(
  //     (data: any) => {
  //       this.group = data;
  //       // this.student.group = this.group.group__name
  //       // this.groupQuestionsByType();
  //       console.log('group', this.group);
  //       this.formateData()

  //     },
  //     (error: any) => {
  //       console.error('Error fetching exam', error);
  //     }
  //   );
  // }

  fetchTeacher(): void {
    this.teacherService.getTecher(this.user__id).subscribe(
      (data: any) => {
        this.teacher = data[0];
this.group = this.teacher.groups
        this.subjectsArray = this.teacher.subjects
    
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

    this.teacherService.updatePicture(file,this.user__id).subscribe(
      (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail:  response.message });
        console.log('responseresponse :',response.message);

    this.updateimg=false
      },
      (error: any) => {

        if (error.error?.message) {
          this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
        } else {
          this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  GlobalConstants.genericError });

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
  user__email : this.teacher.user__email
}
    this.userService.forgotPassword(data).subscribe(
      (response: any) => {
        this.logout()
        this.messageService.add({ severity: 'success', summary: 'Success', detail:  response.message });

        console.log('seccess', response);
 
       
  
      },
      (error: { error: { message: any } }) => {
        //this.ngxService.stop();
        if (error.error?.message) {
          this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
        } else {
          this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  GlobalConstants.genericError });

        }
        // alert(this.responseMessage +" " +GlobalConstants.error);
       
      }
    );
  }





}
