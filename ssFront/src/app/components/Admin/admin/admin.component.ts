import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule,TooltipModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
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
