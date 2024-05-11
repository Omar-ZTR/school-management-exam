import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { DashStudentComponent } from "./dash-student/dash-student.component";
import { UpdateProfileComponent } from "./update-profile/update-profile.component";
@Component({
    selector: 'app-student',
    standalone: true,
    templateUrl: './student.component.html',
    styleUrl: './student.component.css',
    imports: [RouterOutlet,RouterModule,  CommonModule, SidebarComponent, DashStudentComponent, UpdateProfileComponent],
  
})
export class StudentComponent {

    isMenuMobile = true;

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