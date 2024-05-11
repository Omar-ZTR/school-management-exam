import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Icon } from 'ionicons/dist/types/components/icon/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
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
