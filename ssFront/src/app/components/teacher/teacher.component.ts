import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherComponent {

  isMenuMobile = true;
  showExams = false;

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

  logout() {
    // Add your logout logic here
  }

}
