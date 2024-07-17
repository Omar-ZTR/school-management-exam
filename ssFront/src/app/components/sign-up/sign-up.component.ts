import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  
} from '@angular/forms';
import { GlobalConstants } from '../../shared/global-constants';
import { UserService } from '../../services/servicesUser/user.service';
import { SnackbarService } from '../../services/servicesUser/snackbar.service';
import { FileUploadModule } from 'primeng/fileupload';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule,FileUploadModule, ReactiveFormsModule,CalendarModule, PasswordModule, InputTextModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  styles: [
    `
      :host ::ng-deep .p-calendar , .p-inputtext {
        width:100% !important;
        background-color: rgba(255, 255, 255, 0.07) !important;
        color:white !important;
        backdrop-filter: blur(15px) !important;
        -webkit-backdrop-filter: blur(5px) !important;
        min-height:45px !important;
      }
      :host ::ng-deep .p-icon-wrapper {
      
        color:white !important;
      }
      :host ::ng-deep .p-datepicker  {
        transform-origin: center bottom !important; 
        top: -283px !important;
      }
      :host ::ng-deep .p-datepicker table td > span {
      
    width: 30px !important;
    height: 30px;
        
      }
      :host ::ng-deep .p-datepicker table td{
        padding:0 !important;
      }
      :host ::ng-deep .p-datepicker-next chevronrighticon{
        color: #4b5563 !important;
      }
      :host ::ng-deep .p-datepicker-prev chevronlefticon{
        color: #4b5563 !important;
      }
    `,
  ],
})
export class SignUpComponent {
  signupform: FormGroup;
  stepslist: any[] = [
    { stepName: 'Basic details', iscomplate: false },
    { stepName: 'skills', iscomplate: false },
    { stepName: 'experience', iscomplate: false },
  ];

  responseMessage: any;
  selectedFile: any;
  selectedFileName:string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name
      this.selectedFile = input.files;
      this.signupform.patchValue({ CV: input.files[0] });
    }
    console.log("dafgHJGJHGJGajhah",this.signupform.value)
  }
  maxBirthdayDate: Date;
  constructor(private userService: UserService, private snackbarService:SnackbarService) {
    this.maxBirthdayDate = new Date();
    this.maxBirthdayDate.setFullYear(this.maxBirthdayDate.getFullYear() - 18);
    this.signupform = new FormGroup({
      first__name: new FormControl('', [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]),
      last__name: new FormControl('', [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]),
      role: new FormControl('', [Validators.required]),
      user__email: new FormControl('', [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]),
      description: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required,Validators.minLength(8)]),
      rePassword: new FormControl('', [Validators.required,Validators.minLength(8), GlobalConstants.passwordMatchValidator]),
      CV: new FormControl([], [Validators.required]),
      birthday: new FormControl('', [Validators.required, GlobalConstants.minimumAgeValidator(18)]),
    });
  }
  radioo(){
    // console.log(this.userObj.role);
  }
  activeStep: any = this.stepslist[0];
  progwidthvalue: number = 8;

  setActiveStep(activeStep: any) {
    this.activeStep = activeStep;
  }
  gotoStep1() {
    const currentStep = this.stepslist.find(
      (m) => m.stepName == this.activeStep.stepName
    );
    currentStep.iscomplate = true;
    this.activeStep = this.stepslist[0];
    this.progwidthvalue = 8;
  }
  gotoStep2() {
    const FirstNameControl = this.signupform.get('first__name');
  const LastNameControl = this.signupform.get('last__name');
  const BirthdayControl = this.signupform.get('birthday');
  
  // Check validity and mark controls as touched to display errors if necessary
  FirstNameControl?.markAsTouched();
  LastNameControl?.markAsTouched();
  BirthdayControl?.markAsTouched();
  
  if (FirstNameControl?.valid && LastNameControl?.valid && BirthdayControl?.valid) {
    const currentStep = this.stepslist.find(
      (m) => m.stepName == this.activeStep.stepName
    );
    currentStep.iscomplate = true;
    this.activeStep = this.stepslist[1];
    this.progwidthvalue = 50;}
  }

  gotoStep3() {
  
    const EmailControl = this.signupform.get('user__email');
    const PasswordControl = this.signupform.get('Password');
    const rePasswordControl = this.signupform.get('rePassword');
    
    // Check validity and mark controls as touched to display errors if necessary
    EmailControl?.markAsTouched();
    PasswordControl?.markAsTouched();
    rePasswordControl?.markAsTouched();
    
    if (EmailControl?.valid && PasswordControl?.valid && rePasswordControl?.valid ) {
    const currentStep = this.stepslist.find(
      (m) => m.stepName == this.activeStep.stepName
    );
    currentStep.iscomplate = true;
    this.activeStep = this.stepslist[2];
    this.progwidthvalue = 100;
  }}
  // rad:string='';
  // // userObj: any = {
  // //   user__id: 0,
  // //   first__name: '',
  // //   last__name: '',
  // //   user__email: '',
  // //   password: '',
  // //   repassword: '',
  // //   role: this.rad,
  // //   diploma: '',
  // //   Locations: '',
  // //   date__diploma: '',
  // //   experience: '',
  // //   specialty: '',
  // //   date: '',
  // // };

 signup() {

    // Mark all form controls as touched to trigger validation messages
    Object.values(this.signupform.controls).forEach(control => {
      control.markAsTouched();
    });
  
    // Check if the form is valid
    if (this.signupform.valid) {
      console.log(this.signupform.value);
  
      const dataUser = {
        User: this.signupform.value,
        files: this.selectedFile, // Assuming 'CV' is the form control for files
      };
  
      console.log("dataUser", dataUser);
      this.userService.signup(dataUser).subscribe(
        (response: any) => {
         
          alert('Successfully signup');
          console.log('seccess', response);
        },
        (error: { error: { message: any; }; })=>{
          //this.ngxService.stop();
          if(error.error?.message){
            this.responseMessage = error.error?.message;
          }else{
            this.responseMessage = GlobalConstants.genericError;
          }
          // alert(this.responseMessage +" " +GlobalConstants.error);
          this.snackbarService.openSnackBar(this.responseMessage , GlobalConstants.error);
        })
    
  
      // Proceed with further logic (e.g., API call, data processing)
    } else {
      // Form is invalid, handle error or display messages
      console.error("Form is invalid. Please check the fields.");
      // Optionally, you can display error messages in the UI
    }
   
   }




}
