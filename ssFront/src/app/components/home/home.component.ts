import { Component } from '@angular/core';
import { NavComponent } from "./nav/nav.component";
import { HeadComponent } from "./head/head.component";
import { CardComponent } from "./card/card.component";
import { FooterComponent } from "./footer/footer.component";
import { InfoComponent } from "./info/info.component";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [RouterLink,NavComponent, HeadComponent, CardComponent, FooterComponent, InfoComponent]
})
export class HomeComponent {

}
