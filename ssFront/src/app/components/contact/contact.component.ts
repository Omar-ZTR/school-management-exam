import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContactService } from '../../services/servicesUtils/contact.service';
import { TokenServiceService } from '../../services/servicesUser/token-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    FormsModule,],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  isUser: boolean=false;
  answers: any;
 email:any;
  constructor(private fb: FormBuilder,  private messageService : MessageService, private contactService: ContactService,    private tokenService: TokenServiceService,) {
    this.contactForm = this.fb.group({
      sender__name: ['', Validators.required],
      sender__email: ['', [Validators.required, Validators.email]],
      recipient__email: ['omarzouiter97@gmail.com'],

      message: ['', Validators.required]
    });
  }

  ngOnInit(): void { 

    
    const token = localStorage.getItem('token');
    if(token){
      this.isUser = true
      this.email= this.tokenService.getEmailFromToken();
      this.getAnswers()
    }
    console.log("isUser",this.isUser)

  }

  send(): void {
    if (this.contactForm.valid) {
      console.log("contact form value ",this.contactForm.value);
      // Here you can handle the form submission, e.g., send the data to a server

      this.contactService.createmessage(this.contactForm.value).subscribe(
        (data: any) => {
        
          console.log('seccess', data);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message send successfully' });
    
          this.contactForm.reset({
            sender__name: '',
            sender__email: '',
            recipient__email: 'omarzouiter97@gmail.com',
            message: ''
          });
         
    
        },
        (error: { error: { message: any } }) => {
          //this.ngxService.stop();
          if (error.error?.message) {
            this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
          }
          // alert(this.responseMessage +" " +GlobalConstants.error);
         
        }

      )



    }
  }

getAnswers(){

  this.contactService.getContacts(this.email).subscribe(
    (data: any) => {
    
      console.log('answers is ', data);
      // this.chat.push(data)
   this.answers=data
    },
    (error: { error: { message: any } }) => {
      console.log('errrr', error);
    }

  )

}


}