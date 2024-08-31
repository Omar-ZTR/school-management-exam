import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TokenServiceService } from '../../services/servicesUser/token-service.service';
import { StudentService } from '../../services/serviceStudent/student.service';
import { Student } from './dash-student/dash-student.component';

@Component({
    selector: 'app-student',
    standalone: true,
    templateUrl: './student.component.html',
    styleUrl: './student.component.css',
    imports: [CommonModule, RouterOutlet,TooltipModule, RouterModule,],
  
})
export class StudentComponent {

  isMenuMobile = true;
  showExams = false;
  student: Student = {
    first__name: '',
    last__name: '',
    group: '',
    user__email: '',
    img__path: ''
  };
  imgProfil: any;
  user__id = this.tokenService.getUserIdFromToken();
  constructor(
    private router: Router,
    private tokenService: TokenServiceService,
    private studentService: StudentService,
  ) {}
  toggleExams(): void {
    this.showExams = !this.showExams;
  }
  toggleMenu() {
    this.isMenuMobile = !this.isMenuMobile;
  }
  isSettingsMenuOpen: boolean = false;

  toggleSettingsMenu() {
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }
  ngOnInit(): void {
    this.fetchStudent();
  }

  fetchStudent(): void {
    console.log("hdshdshdhs", this.user__id)
    this.studentService.getStudent(this.user__id).subscribe(
      
      (data: any) => {
        this.student = data;
        // this.groupQuestionsByType();
        console.log('student', this.student);
     this.imgProfil = data.img__path
    
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }
}