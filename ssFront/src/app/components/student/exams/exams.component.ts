import { Component } from '@angular/core';
import { CalandarService } from '../../../services/serviceTeacher/calandar.service';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../../services/serviceTeacher/exam.service';
import { DialogModule } from 'primeng/dialog';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';
import { ButtonModule } from 'primeng/button';
import { ExamtakenComponent } from '../examtaken/examtaken.component';
import { InputOtpModule } from 'primeng/inputotp';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { CarouselModule } from 'primeng/carousel';
import { SubscribeService } from '../../../services/servicesUtils/subscribe.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-exams',
  standalone: true,
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputOtpModule,
    ExamtakenComponent,
    CarouselModule
  ],
  
  styles: [
    `
     

      :host ::ng-deep .p-carousel-indicators .p-link {
       /* border: 2px solid #e5e7eb !important; */
    background: #f4a21e !important;
   
    border-radius: 10px !important;
      }
      :host ::ng-deep .p-carousel-items-content{
        display: flex !important;
         justify-content:center !important;
       
      }
      :host ::ng-deep .p-carousel-items-container{
        display: flex !important;
         justify-content:center !important;
         padding: 0 30px;
      }
     
    `,
  ],
  
  

})
export class ExamsComponent {

  examlist: any;
  plan: any = {};
  ready: boolean = false;
  accept: boolean = false;
  otpForm!: FormGroup;
  userId = this.tokenService.getUserIdFromToken();
  groupId = this.tokenService.getGroupIdFromToken();
  CourseExam: any;
  CertifExam: any;
  subscribe: { [key: number]: { check?: any; acceptation?: any } } = {};
  subscribes: any;

  fakesubscribe: { [key: number]: { check?: any; acceptation?: any } } = {};

  constructor(
    private tokenService: TokenServiceService,
    private fb: FormBuilder,
    private calandarService: CalandarService,
    private examService: ExamService,
    private subscribeService: SubscribeService,
    private messageService : MessageService,
  ) {}
  responsiveOptions: any[] | undefined;

  examShow: any = {
    exam__id: '',
    subject: '',
    exam__type: '',
    fileExam: [],
    questions: [],
  };
  visible: boolean = false;
  days!: string;
  hours!: string;
  minutes!: string;
  seconds!: string;
  countdownInterval!: any;

  hasSupportFile(examShow: any): boolean {
    return examShow.fileExam.some((file: { file__type: string; }) => file.file__type === 'support');
  }

  ngOnInit(): void {



    this.responsiveOptions = [
      {
          breakpoint: '1400px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '1220px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '1100px',
          numVisible: 1,
          numScroll: 1
      }
  ];
console.log("sgroupIdgroupIdss", this.groupId)

    this.otpForm = this.fb.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
    });
    this.fetchExams();
    console.log('exams iss is ', this.examlist);
  }
  acceptcode() {
    const correctCode = this.plan.code;
    const otpValues =
      this.otpForm.get('otp1')?.value +
      this.otpForm.get('otp2')?.value +
      this.otpForm.get('otp3')?.value +
      this.otpForm.get('otp4')?.value;
    console.log(otpValues);
    if (otpValues === correctCode) {
      this.accept = true;
   
      console.log(this.accept);
    }
  }

  takeExam() {
    this.visible = false;
    this.ready = true;
    console.log(this.ready);
  }

  // otp1: string = '';
  // otp2: string = '';
  // otp3: string = '';
  // otp4: string = '';
  // otpValues: string ='';
  // code1(event:any){
  //   this.otp1=event
  // }
  // code2(event:any){
  //   this.otp2=event
  // }
  // code3(event:any){
  //   this.otp3=event
  // }
  // code4(event:any){
  //   this.otp4=event
  // }
  loadAnswer(reponses: any) {
   if(reponses){
    this.accept= false
    this.ready= false
    this.CourseExam = this.CourseExam.filter((exam: any) => exam.exam__id !== reponses.exam__id);
    this.CertifExam = this.CertifExam.filter((exam: any) => exam.exam__id !== reponses.exam__id);

   }
    }
  showDialog(reservation: any) {
    this.visible = true;
    this.plan = reservation;
    console.log(this.plan);

 
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    // this.updateCountdown(reservation.startDate);


    this.countdownInterval = setInterval(() => {
      this.updateCountdown(reservation.startDate);
    }, 1000);

    this.fetchExam(reservation.exam__id)
      .then((exam) => {
        this.examShow = exam;
        console.log('Exam show: ', this.examShow);
      })
      .catch((error) => {
        console.error('Error fetching exam', error);
      });
  }

  updateCountdown(startDate: string) {
    const start = new Date(startDate).getTime();
    const now = new Date().getTime();
    const difference = start - now;
console.log("difference difference difference",difference)
    this.days = Math.floor(difference / (1000 * 60 * 60 * 24))
      .toString()
      .padStart(2, '0');
    this.hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
      .toString()
      .padStart(2, '0');
    this.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, '0');
    this.seconds = Math.floor((difference % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, '0');

   
    if (difference <= 0) {
      clearInterval(this.countdownInterval);
      this.days = '00';
      this.hours = '00';
      this.minutes = '00';
      this.seconds = '00';
    }

    console.log(this.days, this.hours, this.minutes, this.seconds);
  }

  statutExam(id: any): void {
    this.fetchExam(id)
      .then((exam) => {
        console.log('Exam status is', exam?.obligatoire);
        return exam?.obligatoire;
      })
      .catch((error) => {
        console.error('Error fetching exam status', error);
      });
  }

  async fetchExam(id: any): Promise<any> {
    try {
      const exam = await this.examService.getExamByid(id).toPromise();
      console.log('Exam data: ', exam);

      return exam;
    } catch (error) {
      console.error('Error fetching exam', error);
      throw error;
    }
  }
  fetchExams(): void {

    this.calandarService.getExams(this.groupId).subscribe(
      (data) => {
        this.examlist = data;
        this.CourseExam = this.examlist.filter((exam: any) => exam.obligation === true);
        this.CertifExam = this.examlist.filter((exam: any) => exam.obligation === false);
        console.log("CourseExamCourseExam",this.CourseExam)
        console.log("CertifExamCertifExam",this.CertifExam)
        console.log("examlistexamlist",this.examlist)
        this.getSubscribe();
        for( const course of this.CourseExam) {
        
            this.fakesubscribe[course.exam__id] = { check: true, acceptation: true };
          }
          for( const certife of this.CertifExam) {
        
            this.subscribe[certife.exam__id] = { check: null, acceptation: null };
          }
        
        console.log('nnddd', this.examlist);
      },
      (error) => {
        console.error('Error fetching fake questions', error);
      }
    );
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

  checkAcceptation(){
    for( const Certif of this.CertifExam) {
      if (!this.subscribe[Certif.exam__id]) {
        this.subscribe[Certif.exam__id] = { check: false, acceptation: null };
      }
      for( const subs of this.subscribes) {
        console.log("examcdrtf",Certif)
        console.log("subs subs sbus",subs)
        if(subs.exam__id == Certif.exam__id && subs.user__id == this.userId)
        this.subscribe[Certif.exam__id] = { check: true, acceptation: subs.acceptation };

      }
     
  
      console.log('Subscription status for', Certif.exam__id, ':', this.subscribe[Certif.exam__id]);
    };
  }

  getSubscribe(): void {
 console.log("hadha examscomp")
      this.subscribeService.getSubscribes().subscribe(



        (data: any) => {
          console.log('Subscription check data:', data);
        this.subscribes = data
        this.checkAcceptation()
        },
        (error: { error: { message: any } }) => {
          console.error('Error checking subscription:', error);
        }
      );
  
   
  
  }

sendSubscribe(){
  const subscribeData = {
   exam__id: this.plan.exam__id,

    user__id: this.userId,
  };
  console.log('data  subscribeData:', subscribeData);

  this.subscribeService.createSubscribe(subscribeData).subscribe(
    (data: any) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail:  'Subscribe request sended successfully' });
      this.subscribe[subscribeData.exam__id].check = true;
      console.log('seccess', data);

      
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
