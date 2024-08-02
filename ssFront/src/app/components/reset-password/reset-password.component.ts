import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../services/servicesUser/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [  PasswordModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  styles: [
    `
      :host ::ng-deep .p-inputtext {
        width:100% !important;
        background-color: rgba(255, 255, 255, 0.07) !important;
        color: #212121  !important;
        backdrop-filter: blur(15px) !important;
        -webkit-backdrop-filter: blur(5px) !important;
        height:45px !important;
      }
      :host ::ng-deep .p-icon-wrapper {
      
        color: #212121  !important;
      }
     
    `,
  ],
})
export class ResetPasswordComponent implements OnInit  {
  resetPasswordForm: FormGroup;

  id!: string;
  token!: string;

constructor(private userService : UserService,
  private route: ActivatedRoute,
  private fb: FormBuilder,
){ this.resetPasswordForm = this.fb.group({
  password: ['', [Validators.required, Validators.minLength(8)]],
  confirmPassword: ['', [Validators.required]],
}, { validator: this.passwordMatchValidator });}
ngOnInit(): void {
  this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
  console.log("ghfjfjffhgfjhf",this.id,this.token)
}
passwordMatchValidator(formGroup: FormGroup) {
  return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value ? null : { mismatch: true };
}

resetPass() {
  const data = {
    user__id: this.id,
        token: this.token,
        password: this.resetPasswordForm.get('password')?.value,
  };
    this.userService.resetPassword(data).subscribe(
      (response: any) => {
        alert(response.message);
        console.log('seccess', response);
       
      },
      (error: { error: { message: any } }) => {
        //this.ngxService.stop();
        // if (error.error?.message) {
        //   this.responseMessage = error.error?.message;
        // } else {
        //   this.responseMessage = GlobalConstants.genericError;
        // }
        // // alert(this.responseMessage +" " +GlobalConstants.error);
        // this.snackbarService.openSnackBar(
        //   this.responseMessage,
        //   GlobalConstants.error
        // );
        // console.log('refu', error);
      }
    );
  }
}


