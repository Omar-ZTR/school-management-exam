import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-listview',
  standalone: true,
  imports: [CommonModule, AccordionModule],
  templateUrl: './listview.component.html',
  styleUrl: './listview.component.css'
})
export class ListviewComponent {
  @Input() data: any;
}
