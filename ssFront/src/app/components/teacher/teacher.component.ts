import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { TeacherService } from '../../services/serviceTeacher/teacher.service';
import { Teacher } from './teacher-dash/teacher-dash.component';
import { TokenServiceService } from '../../services/servicesUser/token-service.service';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, TooltipModule, RouterOutlet, RouterModule],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css',
})
export class TeacherComponent {
  teacher!: Teacher;
  isMenuMobile = true;
  showExams = false;
  imgProfil: any;
  user__id = this.tokenService.getUserIdFromToken();
  constructor(
    private router: Router,
    private tokenService: TokenServiceService,
    private teacherService: TeacherService
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
  ngOnInit(): void {
    this.fetchTeacher();
  }
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }
  fetchTeacher(): void {
    this.teacherService.getTecher(this.user__id).subscribe(
      (data: any) => {
        this.teacher = data[0];

        this.imgProfil = this.teacher.img__path;
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }
}
