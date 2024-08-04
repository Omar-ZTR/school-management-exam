import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

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
  constructor(private router: Router) { }
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

}