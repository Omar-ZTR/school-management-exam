import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  signupform: FormGroup;
  stepslist: any[] = [
    { stepName: 'Basic details', iscomplate: false },
    { stepName: 'skills', iscomplate: false },
    { stepName: 'experience', iscomplate: false },
  ];

  responseMessage: any;

  
  constructor(private userService: UserService, private snackbarService:SnackbarService) {
    this.signupform = new FormGroup({
      first__name: new FormControl('', [Validators.required,Validators.pattern(GlobalConstants.nameRegex)]),
      last__name: new FormControl('', [Validators.required,Validators.pattern(GlobalConstants.nameRegex)]),
      role: new FormControl('', [Validators.required]),
      user__email: new FormControl('', [Validators.required,Validators.pattern(GlobalConstants.emailRegex)]),
      date__diploma: new FormControl('', [Validators.required]),
      Locations: new FormControl('', [Validators.required,Validators.pattern(GlobalConstants.nameRegex)]),
      diploma: new FormControl('', [Validators.required,Validators.pattern(GlobalConstants.nameRegex)]),
      Password: new FormControl('', [Validators.required]),
      experience: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      specialty: new FormControl('', [Validators.required]),
      checkbox: new FormControl('', [Validators.required]),
     
    });
  }
  radioo(){
    console.log(this.userObj.role);
  }
  activeStep: any = this.stepslist[0];
  progwidthvalue: number = 8;

  setActiveStep(activeStep: any) {
    this.activeStep = activeStep;
  }
  gotoStep2() {
    const currentStep = this.stepslist.find(
      (m) => m.stepName == this.activeStep.stepName
    );
    currentStep.iscomplate = true;
    this.activeStep = this.stepslist[1];
    this.progwidthvalue = 50;
  }

  gotoStep3() {
    const currentStep = this.stepslist.find(
      (m) => m.stepName == this.activeStep.stepName
    );
    currentStep.iscomplate = true;
    this.activeStep = this.stepslist[2];
    this.progwidthvalue = 100;
  }
  rad:string='';
  userObj: any = {
    user__id: 0,
    first__name: '',
    last__name: '',
    user__email: '',
    password: '',
    role: this.rad,
    diploma: '',
    Locations: '',
    date__diploma: '',
    experience: '',
    specialty: '',
    date: '',
  };

  signup() {

    console.log(this.userObj);
    this.userService.signup(this.userObj).subscribe(
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
  
    }




}
