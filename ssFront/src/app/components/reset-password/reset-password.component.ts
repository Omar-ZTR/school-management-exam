import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../services/servicesUser/user.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CheckSuccessComponent } from '../../shared/check-success/check-success.component';
import { MessageService } from 'primeng/api';
import { GlobalConstants } from '../../shared/global-constants';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    PasswordModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckSuccessComponent,
    RouterModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  styles: [
    `
      :host ::ng-deep .p-inputtext {
        width: 100% !important;
        background-color: rgba(255, 255, 255, 0.07) !important;
        color: #212121 !important;
        backdrop-filter: blur(15px) !important;
        -webkit-backdrop-filter: blur(5px) !important;
        height: 45px !important;
      }
      :host ::ng-deep .p-icon-wrapper {
        color: #212121 !important;
      }
    `,
  ],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;

  id!: string;
  token!: string;
  check: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        Password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, GlobalConstants.passwordMatchValidator]],
      },
     
    );
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    console.log('ghfjfjffhgfjhf', this.id, this.token);
  }

  resetPass() {
    const data = {
      user__id: this.id,
      token: this.token,
      password: this.resetPasswordForm.get('Password')?.value,
    };
    this.userService.resetPassword(data).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });

        console.log('seccess', response);

        this.check = true;
      },
      (error: { error: { message: any } }) => {
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
      }
    );
  }
}
