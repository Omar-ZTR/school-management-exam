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
  ],
})
export class ExamsComponent {
  examlist: any;
  plan: any = {};
  ready: boolean = false;
  accept: boolean = false;
  otpForm!: FormGroup;

  groupId = this.tokenService.getGroupIdFromToken();

  constructor(
    private tokenService: TokenServiceService,
    private fb: FormBuilder,
    private calandarService: CalandarService,
    private examService: ExamService
  ) {}

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
  ngOnInit(): void {

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

  showDialog(reservation: any) {
    this.visible = true;
    this.plan = reservation;
    console.log(this.plan);

    // Clear any existing interval to avoid multiple intervals running
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.updateCountdown(reservation.startDate);

    // Start a new interval to update the countdown every second

    // this.countdownInterval = setInterval(() => {
    //   this.updateCountdown(reservation.startDate);
    // }, 1000);

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

    // Check if the countdown is finished
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
console.log("aksjjjjjjjjjjjjjjjjjjjjj",this.groupId)
    this.calandarService.getExams(this.groupId).subscribe(
      (data) => {
        this.examlist = data;
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
}
