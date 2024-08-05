import { Component, OnInit } from '@angular/core';
import { ExamAnswersService } from '../../../services/serviceAnswers/exam-answers.service';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { GroupService } from '../../../services/servicesUtils/group.service';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../services/serviceStudent/student.service';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../services/servicesUser/user.service';
import { GlobalConstants } from '../../../shared/global-constants';
import { Router } from '@angular/router';
interface Student {
  first__name:string,
  last__name:string,
  group:string,
  user__email:string,
  img__path:string,
} 
@Component({
  selector: 'app-dash-student',
  standalone: true,
  imports: [CommonModule,TooltipModule],
  templateUrl: './dash-student.component.html',
  styleUrl: './dash-student.component.css'
})
export class DashStudentComponent implements OnInit {
  user__id = this.tokenService.getUserIdFromToken();
  group__id = this.tokenService.getGroupIdFromToken();
  group: any;
  subjectsArray:any[] =[]
  student: Student = {
    first__name: '',
    last__name: '',
    group: '',
    user__email: '',
    img__path: ''
  };
  imgProfil: any = '';
  imgUp: any;
  updateimg: boolean = false;
  results: any[] = [];
  constructor(
    private groupService: GroupService,
    private tokenService: TokenServiceService,
    private studentService: StudentService,
    private AnswersService: ExamAnswersService,
    private userService: UserService,
    private messageService : MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchStudent()
    this.fetchIngroup();
    this.fetchAnswers()
    
  }

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

  loadFile(event:any){

  }
  async detectFilesSupport(event: any) {
    let files = event.target.files;

    if (files) {
      for (let file of files) {
    this.imgUp = file
this.updateimg = true
        await this.readFileAsync(file).then((url: any) => {
        this.imgProfil = url
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


  fetchIngroup(): void {
    this.groupService.getoneGroup(this.group__id).subscribe(
      (data: any) => {
        this.group = data;
        this.student.group = this.group.group__name
        // this.groupQuestionsByType();
        console.log('group', this.group);
        this.formateData()
    
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }

  fetchStudent(): void {
    this.studentService.getStudent(this.user__id).subscribe(
      (data: any) => {
        this.student = data;
        // this.groupQuestionsByType();
        console.log('student', this.student);
     this.imgProfil = data.img__path
    
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }

  formateData(): void {
    // Add a property 'answers' to each exam in the group to hold the related answers
  

    for (const sub of this.group.subjects) {
      let count = 0;
      let i = 0;

    

      if (this.group.exams.length > 0) {
        for (const exam of this.group.exams) {
         
          if (exam.subject === sub.subject__name) {
            count = count + 1;
            if (exam.answers.length > 0) {
              for (const ans of exam.answers) {
                if(ans.student__id == this.user__id){
                  i = i + 1;
                 
                }
             
              }
            } 
          }
        }
      }
      let formdata = {
        subject: sub.subject__name,
       nb__exam : count,
       nb__examDone: i,
       teacher:sub.teacher
      };

      this.subjectsArray.push(formdata)

    }
    console.log('my formated with subjects',);
  
    // Optional: Print out the formatted data for debugging
    // console.log('Formatted group data', this.group);
  }



  savePdp(): void {


const file = this.imgUp

    this.studentService.updatepdp(file,this.user__id).subscribe(
      (response: any) => {
   
        // this.groupQuestionsByType();
        console.log('responseresponse :',response.message);
  
    this.updateimg=false
      },
      (error: any) => {
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
      user__email : this.student.user__email
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
