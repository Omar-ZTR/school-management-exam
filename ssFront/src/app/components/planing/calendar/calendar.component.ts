import { Component, Input } from '@angular/core';
import { mapCoursesToSchedulerEvents } from '../reservUtils';
import { CommonModule } from '@angular/common';
import { BookedCourse } from '../entities';
import { MonthViewModule, SchedulerModule } from '@progress/kendo-angular-scheduler';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MonthViewModule, SchedulerModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  @Input({ transform: mapCoursesToSchedulerEvents }) courses: BookedCourse[] =
  [];
}
