import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
@Component({
  selector: 'app-head',
  standalone: true,
  imports: [RouterModule ,CarouselModule],
  templateUrl: './head.component.html',
  styleUrl: './head.component.css'
})
export class HeadComponent {

  items = [
    { src: '../../../../assets/homeGrad.png', alt: 'produame', backgroundColor: '#ccccff'  },
    { src: '../../../../assets/groupHome.png', alt: 'produame', backgroundColor: '#ccffcc' },
  
    { src: '../../../../assets/gradHome.png', alt: 'produame' ,backgroundColor: '#ffcccc' },
  ];

  currentBackgroundColor = this.items[0].backgroundColor;
  onPageChange(event: any) {
    this.currentBackgroundColor = this.items[event.page].backgroundColor;
  }

}
