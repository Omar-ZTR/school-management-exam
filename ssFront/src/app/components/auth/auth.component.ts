import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { GlobalConstants } from '../../shared/global-constants';
import { SnackbarService } from '../../services/snackbar.service';
import { CommonModule, Location } from '@angular/common';
import { SignUpComponent } from "../sign-up/sign-up.component";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";
import { CheckSuccessComponent } from "../../shared/check-success/check-success.component";

@Component({
    selector: 'app-auth',
    standalone: true,
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule, SignUpComponent, ResetPasswordComponent, CheckSuccessComponent]
})
export class AuthComponent {
forgotpass: FormGroup;
  
  
  constructor(private location:Location , private fb: FormBuilder,    private snackbarService:SnackbarService,
    private userService: UserService, private router: Router) {

      this.forgotpass = new FormGroup({
        user__email: new FormControl('', [Validators.required,Validators.pattern(GlobalConstants.emailRegex)])
      })
      
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
  responseMessage:any;
  authForm:any = FormGroup;

    onInputChange() {
      // email:[null , Validators.required , Validators.pattern(GlobalConstants.emailRegex)],
      // You can add any additional logic here
    }
    emailerr=''
    modelChangeFn(e: string) {
      
      this.emailerr = e;
    }
    ngOnInit(): void {
      this.authForm = this.fb.group({
        email:[null , Validators.required , Validators.pattern(GlobalConstants.emailRegex)],
        password:[null , Validators.required]
      })
      
    }

  onlogin(loginObj: { user__email: string; password: string }) {
    console.log(loginObj);
    this.userService.login(loginObj).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        alert('Successfully Login');
        console.log('secc', response);
        this.router.navigate(['/dash']);
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



    forgotObj: any = {
     
      user__email: '',
      
    };
  

    check = true


    SendMail() {
  
      console.log(this.forgotObj);
      this.userService.forgotPassword(this.forgotObj).subscribe(
        (response: any) => {
         
          alert(response.message);
          console.log('seccess', response);
          this.check = !this.check
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
          console.log('refu', error);
        })
    
      }




  }