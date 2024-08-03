import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/servicesUser/user.service';
import { GlobalConstants } from '../../shared/global-constants';

@Component({
  selector: 'app-verifie-email',
  standalone: true,
  imports: [],
  templateUrl: './verifie-email.component.html',
  styleUrl: './verifie-email.component.css'
})
export class VerifieEmailComponent implements OnInit {


  id!: string;
  codeVerifey!: string;
  check: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.codeVerifey = this.route.snapshot.paramMap.get('codeVerifey') ?? '';
    console.log('ghfjfjffhgfjhf', this.id, this.codeVerifey);


    this.userService.verifyEmail(this.codeVerifey).subscribe(
      (response: any) => {
      
      },
      (error: { error: { message: any } }) => {
        if (error.error?.message) {
          this.messageService.add({
            severity: 'danger',
            summary: 'Failed',
            detail: error.error?.message,
          });
        } 
      }
    );


  }

  // resetPass() {
  //   const data = {
  //     user__id: this.id,
  //     codeVerifey: this.codeVerifey,
      
  //   };
  //   this.userService.resetPassword(data).subscribe(
  //     (response: any) => {
      
  //     },
  //     (error: { error: { message: any } }) => {
  //       if (error.error?.message) {
  //         this.messageService.add({
  //           severity: 'danger',
  //           summary: 'Failed',
  //           detail: error.error?.message,
  //         });
  //       } 
  //     }
  //   );
  // }
}
