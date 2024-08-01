import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/servicesUser/auth.service';
import { HttpResponse } from '@angular/common/http';
import { UserService } from '../../services/servicesUser/user.service';
import { GlobalConstants } from '../../shared/global-constants';
import { SnackbarService } from '../../services/servicesUser/snackbar.service';
import { CommonModule, Location } from '@angular/common';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { CheckSuccessComponent } from '../../shared/check-success/check-success.component';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  imports: [
    RouterModule,
    PasswordModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SignUpComponent,
    ResetPasswordComponent,
    CheckSuccessComponent,
  ],
  styles: [
    `
      :host ::ng-deep .p-inputtext {
        width:100% !important;
        background-color: rgba(255, 255, 255, 0.07) !important;
        color:white !important;
        backdrop-filter: blur(15px) !important;
        -webkit-backdrop-filter: blur(5px) !important;
        height:45px !important;
      }
      :host ::ng-deep .p-icon-wrapper {
      
        color:white !important;
      }
     
    `,
  ],
})
export class AuthComponent {
  forgotpass: FormGroup;
  msgErrEmail: string = '';

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private messageService : MessageService,
    private router: Router
  ) {
    this.forgotpass = new FormGroup({
      user__email: new FormControl('', [
        Validators.required,
        Validators.pattern(GlobalConstants.emailRegex),
      ]),
    });
  }
  formName = true;

  setswitch() {
    this.formName = !this.formName;
  }
  popy = false;

  popactivation() {
    this.popy = !this.popy;
  }
  goBackToPrevPage(): void {
    this.location.back();
  }

  loginObj = {
    user__email: '',
    password: '',
  };
  responseMessage: any;
  authForm: any = FormGroup;

  onInputChange() {
    // email:[null , Validators.required , Validators.pattern(GlobalConstants.emailRegex)],
    // You can add any additional logic here
  }
  emailerr = '';
  modelChangeFn(e: any) {
    const email = e.value;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (email !== '') {
      if (!emailRegex.test(email)) {
        this.msgErrEmail = 'Email not formatted correctly';
      } else {
        this.msgErrEmail = '';
      }
    } else {
      this.msgErrEmail = '';
    }
  }

  ngOnInit(): void {
    // this.authForm = this.fb.group({
    //   email:[null , Validators.required , Validators.pattern(GlobalConstants.emailRegex)],
    //   password:[null , Validators.required]
    // })
  }

  onlogin() {
    console.log(this.loginObj);
    this.userService.login(this.loginObj).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
     
        this.messageService.add({ severity: 'success', summary: 'Success', detail:  'Welcomme, Successfully Login' });

        const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
        console.log(tokenPayload);
        if (tokenPayload.role === 'Student') {
          this.router.navigate(['/student/dash']);
        } else if (tokenPayload.role === 'teacher') {
          this.router.navigate(['/teacher/dash']);
        } else {
          this.router.navigate(['/']);
        }
      },
      (error: { error: { message: any } }) => {
     
        if (error.error?.message) {
          this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
        } else {
          this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  GlobalConstants.genericError });

        }
        // this.snackbarService.openSnackBar(
        //   this.responseMessage,
        //   GlobalConstants.error
        // );
      }
    );
  }

  forgotObj: any = {
    user__email: '',
  };

  check = false;

  SendMail() {
    console.log(this.forgotObj);
    this.userService.forgotPassword(this.forgotObj).subscribe(
      (response: any) => {
        alert(response.message);
        console.log('seccess', response);
        this.check = !this.check;
      },
      (error: { error: { message: any } }) => {
        //this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        // alert(this.responseMessage +" " +GlobalConstants.error);
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
        console.log('refu', error);
      }
    );
  }
}
