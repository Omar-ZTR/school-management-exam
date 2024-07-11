import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { StudentService } from '../../../services/serviceStudent/student.service';
import { ExamService } from '../../../services/serviceTeacher/exam.service';
import { CommonModule } from '@angular/common';
import { title } from 'process';
import { Student } from '../manage-student/manage-student.component';

@Component({
  selector: 'app-admin-dash',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './admin-dash.component.html',
  styleUrl: './admin-dash.component.css',
})
export class AdminDashComponent implements OnInit {
  Analyse: any;
  labels!: string[];
  count!: number[];
  examsWithAnswers: any[] = [];
  examsWithoutAnswers: any[] = [];
  soon: number = 0;
  completed: number = 0;
  filterResult: {
    [key: number]: { title?: any; highResult?: any[]; lowResult?: any[] };
  } = {};
  students!: Student[];
  studentsAccept!: Student[];
  studentsRefused!: Student[];
  studentsWait!: Student[];
  constructor(
    private StudentService: StudentService,
    private ExamService: ExamService
  ) {}
  data: any;
  doughnut: any;
  doughnutoptions: any;
  options: any;

  ChartPlus: boolean = false;

  showCharts() {
    this.ChartPlus = !this.ChartPlus;
  }

  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  countUp() {
    for (let i = 0; i < this.examsWithAnswers.length; i++) {
      setTimeout(() => {
        this.completed = i + 1;
      }, (i / this.examsWithAnswers.length) * 1000); // i * 1000 milliseconds delay
    }

    for (let i = 0; i < this.examsWithoutAnswers.length; i++) {
      setTimeout(() => {
        this.soon = i + 1;
      }, (i / this.examsWithoutAnswers.length) * 1000); // i * 1000 milliseconds delay
    }
  }
  getLabelsForCurrentMonth() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = currentDate.getDate();

    const labels = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      labels.push(
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      );
    }
    return labels;
  }

  getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  generateLabelsForMonth(month: number, year: number) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = this.getDaysInMonth(year, month);

    const labels = [];
    const endDay =
      month === currentMonth && year === currentYear
        ? currentDate.getDate()
        : daysInMonth;

    for (let day = 1; day <= endDay; day++) {
      labels.push(day.toString());
    }

    return labels;
  }
  doughnutCharts: any[] = [];

  ngOnInit() {
    this.getCountStudents();
    this.getCountExamCertif();
    this.fetchStudents()
    // const documentStyle = getComputedStyle(document.documentElement);
    // const textColor = documentStyle.getPropertyValue('--text-color');
    // const textColorSecondary = documentStyle.getPropertyValue(
    //   '--text-color-secondary'
    // );
    // const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    // const currentMonth = new Date().getMonth(); // 0-indexed, January is 0

    // // Generate month names

    // // Create labels from January to the current month
    // const labels = this.monthNames.slice(0, currentMonth);

    // this.data = {
    //   labels: this.labels,
    //   datasets: [
    //     {
    //       label: 'First Dataset',
    //       data: this.count,
    //       fill: false,
    //       borderColor: documentStyle.getPropertyValue('--blue-500'),
    //       tension: 0.4,
    //     },
    //     {
    //       label: 'Second Dataset',
    //       data: [28, 48, 40, 19, 86, 27, 90],
    //       fill: false,
    //       borderColor: documentStyle.getPropertyValue('--pink-500'),
    //       tension: 0.4,
    //     },
    //   ],
    // };

    // this.options = {
    //   maintainAspectRatio: false,
    //   aspectRatio: 0.6,
    //   plugins: {
    //     legend: {
    //       display: false,
    //     },
    //   },
    //   scales: {
    //     x: {
    //       ticks: {
    //         color: textColorSecondary,
    //       },
    //       grid: {
    //         color: surfaceBorder,
    //         drawBorder: false,
    //       },
    //     },
    //     y: {
    //       ticks: {
    //         color: textColorSecondary,
    //       },
    //       grid: {
    //         color: surfaceBorder,
    //         drawBorder: false,
    //       },
    //     },
    //   },
    // };

    // console.log('analyse tra nguiiss', this.Analyse);
  }
  generateDoughnutCharts() {
    this.examsWithAnswers.forEach((exam) => {
      const doughnut = {
        labels: ['A', 'C'],
        datasets: [
          {
            data: [
              this.filterResult[exam.exam__id].highResult?.length,
              this.filterResult[exam.exam__id].lowResult?.length,
            ],
            backgroundColor: ['#100d6a', '#f97316'],
            hoverBackgroundColor: ['#0d0aad', '#ff8e00'],
          },
        ],
      };

      const doughnutOptions = {
        cutout: '60%',
        plugins: {
          legend: {
            display: false,
          },
        },
      };
      const title = this.filterResult[exam.exam__id].title;
      this.doughnutCharts.push({ doughnut, doughnutOptions, title });
    });
  }

  dataStudent:any;
  StudentOptions:any;
  
  generateAcceptationCharts() {
    
        const accept=this.studentsAccept.length
        const refused=this.studentsRefused.length
        const wait=this.studentsWait.length

      this.dataStudent = {
        labels: [`Accepted ${accept}`, `Refused ${refused}`, `waiting ${wait}`],
        datasets: [
          {
            data: [
           accept,refused,wait
            ],
            backgroundColor: ['#039e31' ,'#ff0000', '#f97316'],
            hoverBackgroundColor: ['#039e31' ,'#ff0000', '#f97316'],
          },
        ],
      };

      this.StudentOptions = {
        cutout: '60%',
        plugins: {
          legend: {
            labels: {
                usePointStyle: true,
                color: '#09782c',
                font: {
                  size: 14, // Set the font size
                  style: 'italic', // Set the font style
                  family: 'Arial', // Set the font family
                },
                padding: 20, // Set padding between legend items
                boxWidth: 20, // Set the box width
              },
          },
        },
      };
    
   
  }


  getCountStudents() {
    this.StudentService.AnalyseStudents().subscribe(
      (data) => {
        console.log('Subjects data:', data);
        this.Analyse = data;
        const fullAnalyse = this.getFullAnalyse(this.Analyse, this.monthNames);
        this.labels = fullAnalyse.map((item: { month: any }) => item.month);
        this.count = fullAnalyse.map((item: { count: any }) => item.count);
        console.log('fullAnalyse', this.labels);
        console.log('fullAnalyse count', this.count);

        // Update the chart data after processing
        this.updateChartData();
      },
      (error) => {
        console.error('Error fetching subjects', error);
      }
    );
  }
  getCountExamCertif() {
    this.ExamService.getcertifExam().subscribe(
      (data: any[]) => {
        console.log('certif exams is data:', data);

        // Filter exams with answers not empty
        this.examsWithAnswers = data.filter(
          (exam: { answers: string | any[] }) => exam.answers.length > 0
        );
        console.log('Exams with answers:', this.examsWithAnswers);

        for (const exam of this.examsWithAnswers) {
          // Initialize the filterResult object for the exam if it doesn't exist
          if (!this.filterResult[exam.exam__id]) {
            this.filterResult[exam.exam__id] = {};
          }

          this.filterResult[exam.exam__id].highResult = exam.answers.filter(
            (answer: any) => answer.ans__result >= 10
          );

          this.filterResult[exam.exam__id].lowResult = exam.answers.filter(
            (answer: any) => answer.ans__result < 10
          );
          this.filterResult[exam.exam__id].title = exam.exam__title;
        }

        console.log('gg', this.filterResult);
        this.generateDoughnutCharts();

        // Filter exams with answers empty
        this.examsWithoutAnswers = data.filter(
          (exam: { answers: string | any[] }) => exam.answers.length === 0
        );
        console.log('Exams without answers:', this.examsWithoutAnswers);
        this.countUp();
      },
      (error) => {
        console.error('Error fetching subjects', error);
      }
    );
  }
  getFullAnalyse(
    analyse: {
      reduce: (
        arg0: (max: any, curr: any) => any,
        arg1: { count: number }
      ) => { (): any; new (): any; month: any };
      map: (
        arg0: (item: any) => any[]
      ) => Iterable<readonly [unknown, unknown]> | null | undefined;
    },
    monthNames: any[]
  ) {
    // Find the month with the maximum count
    const maxCountMonth = analyse.reduce(
      (max: { count: number }, curr: { count: number }) =>
        curr.count > max.count ? curr : max,
      { count: 0 }
    ).month;
    const maxMonthIndex = monthNames.indexOf(maxCountMonth);

    // Create a map of the existing counts
    const monthCountMap = new Map(
      analyse.map((item: { month: any; count: any }) => [
        item.month,
        item.count,
      ])
    );

    // Create the full analyse array
    const fullAnalyse = monthNames
      .slice(0, maxMonthIndex + 1)
      .map((month: unknown) => ({
        month,
        count: monthCountMap.get(month) || 0,
      }));

    return fullAnalyse;
  }

  updateChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.data = {
      labels: this.labels,
      datasets: [
        {
          label: 'First Dataset',
          data: this.count,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      plugins: {
        legend: {
         display:false
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            font: {
              size: 14, // Set the font size
              style: 'italic', // Set the font style
              family: 'Arial', // Set the font family
            },
            padding: 20, // Set padding between legend items
            boxWidth: 20, // Set the box width
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
            stepSize: 1,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  fetchStudents() {
    this.StudentService.getStudents().subscribe(
      (data: Student[]) => {
        this.students = data;
        console.log('All students:', this.students);

        this.studentsAccept = this.students.filter(
          (student) => student.active == true
        );
        this.studentsRefused = this.students.filter(
          (student) => student.active == false
        );
        this.studentsWait = this.students.filter(
          (student) => student.active === null
        );

        this.generateAcceptationCharts() 
        console.log('Accepted students:', this.studentsAccept);
        console.log('Waiting students:', this.studentsWait);
        console.log('Refused students:', this.studentsRefused);
      },
      (error) => {
        console.error('Error fetching students', error);
      }
    );
  }
}
