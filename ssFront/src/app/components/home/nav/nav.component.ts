import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AuthComponent } from '../../auth/auth.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  imports: [RouterModule ,CommonModule]
})
export class NavComponent {
  // isMenuMobile = false;
constructor(private dialog:MatDialog){}
  // toggleMenu() {
  //   this.isMenuMobile = !this.isMenuMobile;
  // }
  handleLoginAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(AuthComponent , dialogConfig)
  }
}
