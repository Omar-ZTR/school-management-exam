import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-listview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listview.component.html',
  styleUrl: './listview.component.css'
})
export class ListviewComponent {
  @Input() data: any;
}
