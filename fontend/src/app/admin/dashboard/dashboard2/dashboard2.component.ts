import { Component, OnInit } from '@angular/core';
import { StorageService } from '@core/service/storage.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexFill,
} from 'ng-apexcharts';
import { AbsenceService } from 'app/admin/absence/service/absence.service'; 
import { Absence } from 'app/admin/absence/model/Absence'; 
import { CalendarService } from 'app/calendar/calendar.service';
import { AllService } from 'app/admin/all/services/all.service';
import { Calendar } from 'app/calendar/calendar.model';
import { User } from 'app/admin/all/model/User';
import { ClockInService } from 'app/employee/dashboard/clock-in-dialog/clock-in.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss'],
})
export class Dashboard2Component implements OnInit {
  public lineChartOptions!: Partial<ChartOptions>;
  // Doughnut chart start
  public areaChartOptions!: Partial<ChartOptions>;
  public smallChart1Options!: Partial<ChartOptions>;
  public smallChart2Options!: Partial<ChartOptions>;
  public smallChart3Options!: Partial<ChartOptions>;
  public smallChart4Options!: Partial<ChartOptions>;
  public barChartOptions!: Partial<ChartOptions>;
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };
  public doughnutChartLabels: string[] = ['India', 'USA', 'Itely'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F', '#EDC948'],  // Updated color palette
        hoverBackgroundColor: ['#376092', '#d2771c', '#b14545', '#558b8a', '#467d3a', '#bda33e'],  // Hover colors
        borderWidth: 2,  // Optional: makes the segments more prominent
      },
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';

  // Doughnut chart end

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  userName?: string;
  public totalProjects: number = 0;
  public totalTasks: number = 0;
  public totalQuestions: number = 0;
  public totalEmployees: number = 0; 
  public totalAnswers: number = 0;
   leaves: Calendar[] = []; 
  colors: string[] = [];
  projectsInProgress: Absence[] = []; 
  projectColors: string[] = [];
  calendars: Calendar[] = [];  // Array to store calendar events
  tagCounts: { [tag: string]: number } = {};  // Object to store tag counts
  color: { [key: string]: string } = {
    work: '#FF5733', // Example colors for different categories
    important: '#33FF57',
    personal: '#3357FF'
  };
  topAdvisors: { name: string; score: number }[] = [];
  constructor(private storageService: StorageService,
    private absenceService: AbsenceService,
    private clockInService: ClockInService,
    private allService: AllService,

    private calendarService: CalendarService,
  
  ) {}
  ngOnInit() {
    const user= this.storageService.getUser();
    this.userName = user.username;
    this.chart1();
    this.fetchTotalAbsences(); 
    this.fetchTotalTasks(); 
    this.fetchTotalQuestions();
  
    this.fetchTotalEmployees();
 
    this.fetchUserCalendars(); 
    this.fetchTopAdvisors();
    this.fetchTagCounts();
  }
  getTopTags(limit: number = 3): { tag: string; count: number }[] {
    // Convert tagCounts object to an array and sort by count in descending order
    const sortedTags = Object.entries(this.tagCounts)
      .map(([tag, count]) => ({ tag, count }))  // Convert to array of objects
      .sort((a, b) => b.count - a.count);  // Sort by count descending
    
    // Return the top 'limit' tags
    return sortedTags.slice(0, limit);
  }
  getDotClass(index: number): string {
    const colors = ['bg-green', 'bg-orange', 'bg-purple'];  // Define your dot colors
    return colors[index % colors.length];  // Return color based on index
  }
// Fetch tag counts method
private fetchTagCounts() {
  this.calendarService.getAllCalendars().subscribe(
    (response) => {
      this.calculateTagCounts(response);  // Calculate tag counts
      this.updateDoughnutChartData();  // Update chart data with tag counts
    },
    (error) => {
      console.error('Failed to fetch questions', error);  // Handle error
    }
  );
}

// Calculate tag counts from questions
private calculateTagCounts(questions: any[]) {  // Specify that questions is an array of any type
  this.tagCounts = {};  // Reset tag counts

  questions.forEach((question: { tags: string[] }) => {  // Define the structure of question
    question.tags.forEach((tag: string) => {  // Specify that tag is a string
      this.tagCounts[tag] = (this.tagCounts[tag] || 0) + 1;  // Increment tag count
    });
  });

  console.log('Tag Counts:', this.tagCounts);  // Debugging
}

// Update doughnut chart data based on tag counts
private updateDoughnutChartData() {
  this.doughnutChartLabels = Object.keys(this.tagCounts);  // Set chart labels as tag names
  this.doughnutChartData.labels = this.doughnutChartLabels;  // Update chart labels
  this.doughnutChartData.datasets[0].data = Object.values(this.tagCounts);  // Set chart data as tag counts

  console.log('Updated Doughnut Chart Data:', this.doughnutChartData);  // Debugging
} 
  
  // Helper method to get tags sorted by their repetition count
getSortedTags(): string[] {
  return Object.keys(this.tagCounts).sort((a, b) => this.tagCounts[b] - this.tagCounts[a]);  // Sort by count descending
}
  private fetchTopAdvisors() {
    this.allService.getAll().subscribe(
      (users: User[]) => {
        console.log('users list:', users);
        // Sort users by score in descending order and get the top 5
        this.topAdvisors = users
          .sort((a, b) => b.score - a.score)  // Sort by score descending
          .slice(0, 5)  // Get top 5 users
          .map(user => ({ name: user.username, score: user.score }));  // Map to format needed for display

        console.log('Top Advisors:', this.topAdvisors);  // Debugging
      },
      (error) => {
        console.error('Failed to fetch users', error);  // Handle error
      }
    );
  }

  private fetchUserCalendars() {
    this.calendarService.getCalendarsByUserId().subscribe(
      (response) => {
        this.calendars = response.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()); // Sort by start date
        console.log("calendars", this.calendars)
      },
      (error) => {
        console.error('Failed to fetch calendars', error);  // Handle error if needed
      }
    );
  }

  

  private fetchTotalEmployees() {
    this.allService.getAll().subscribe(
      (response) => {
        this.totalEmployees = response.length; // Set totalEmployees to the length of the employee list
        this.updateSmallChart2WithEmployees(response); // Update small chart with employees grouped by joiningDate month
      },
      (error) => {
        console.error('Failed to fetch employees', error); // Handle error if needed
      }
    );
  }

  private updateSmallChart2WithEmployees(employees: any[]) {
    const monthCounts: { [key: string]: number } = {};

    employees.forEach((employee) => {
      const joiningDate = new Date(employee.joiningDate);
      const month = joiningDate.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., 'Jan 2024'

      if (!monthCounts[month]) {
        monthCounts[month] = 1;
      } else {
        monthCounts[month]++;
      }
    });

    // Prepare the data for the chart
    const months = Object.keys(monthCounts);
    const chartData = months.map((month) => monthCounts[month]);

    this.smallChart2Options = {
      series: [
        {
          name: 'Employees',
          data: chartData,
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#FD7E14'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: months, // Use formatted months as categories
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private fetchTotalQuestions() {
    this.clockInService.getAllClockIns().subscribe(
      (clockIns) => {
          this.totalQuestions = clockIns.length; // Set totalQuestions to the length of the question list
          this.updateSmallChart4WithQuestions(clockIns); // Update small chart with questions grouped by createdDate month
      },
      (error) => {
        console.error('Failed to fetch questions', error); // Handle error if needed
      }
    );
  }
  private updateSmallChart4WithQuestions(clockins: any[]) {
    const monthCounts: { [key: string]: number } = {};

    clockins.forEach((clockin) => {
      const createdDate = new Date(clockin.time);
      console.log("clock in ", clockin)
      const month = createdDate.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., 'Jan 2024'

      if (!monthCounts[month]) {
        monthCounts[month] = 1;
      } else {
        monthCounts[month]++;
      }
    });

    // Prepare the data for the chart
    const months = Object.keys(monthCounts);
    const chartData = months.map((month) => monthCounts[month]);

    this.smallChart4Options = {
      series: [
        {
          name: 'check In',
          data: chartData,
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#2196F3'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: months, // Use formatted months as categories
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  private fetchTotalTasks() {
    this.calendarService.getAllCalendars().subscribe(
      (calendars) => {
        this.leaves=calendars
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        this.totalTasks = calendars.length; // Set totalTasks to the length of the task list
        this.updateSmallChart3WithTasks(calendars); // Update small chart with tasks grouped by dueDate month
      },
      (error) => {
        console.error('Failed to fetch tasks', error); // Handle error if needed
      }
    );
  }

  private fetchTotalAbsences() {
    this.absenceService.getAbsences().subscribe(
      (absences) => {
        this.totalProjects = absences.length; // Set totalProjects to the length of the project list
        this.updateSmallChart1WithProjects(absences); // Update small chart with projects
      },
      (error) => {
        console.error('Failed to fetch absences', error); // Handle error if needed
      }
    );
  }
  private updateSmallChart3WithTasks(calendars: Calendar[]) {
    const monthCounts: { [key: string]: number } = {};

    calendars.forEach((calendars) => {
      const dueDate = new Date(calendars.startDate);
      const month = dueDate.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., 'Jan 2024'

      if (!monthCounts[month]) {
        monthCounts[month] = 1;
      } else {
        monthCounts[month]++;
      }
    });

    // Prepare the data for the chart
    const months = Object.keys(monthCounts);
    const chartData = months.map((month) => monthCounts[month]);

    this.smallChart3Options = {
      series: [
        {
          name: 'Leaves',
          data: chartData,
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#4CAF50'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: months, // Use formatted months as categories
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  
  private updateSmallChart1WithProjects(projects: any[]) {
    // Extracting the month from startDate and formatting as 'MMM YYYY'
    const monthCounts: { [key: string]: number } = {};
  
    projects.forEach((project) => {
      const startDate = new Date(project.startDate);
      const month = startDate.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., 'Jan 2024'
      
      if (!monthCounts[month]) {
        monthCounts[month] = 1;
      } else {
        monthCounts[month]++;
      }
    });
  
    // Prepare the data for the chart
    const months = Object.keys(monthCounts);
    const chartData = months.map((month) => monthCounts[month]);
  
    this.smallChart1Options = {
      series: [
        {
          name: 'Absences',
          data: chartData,
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#6F42C1'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: months, // Use formatted months as categories
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  
  private chart1() {
    this.lineChartOptions = {
      series: [
        {
          name: 'tech 1',
          data: [70, 200, 80, 180, 170, 105, 210],
        },
        {
          name: 'tech 2',
          data: [80, 250, 30, 120, 260, 100, 180],
        },
        {
          name: 'tech 3',
          data: [85, 130, 85, 225, 80, 190, 120],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        foreColor: '#9aa0ac',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#A5A5A5', '#875692', '#4CB5AC'],
      stroke: {
        curve: 'smooth',
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },

      markers: {
        size: 3,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        title: {
          text: 'Month',
        },
      },
      yaxis: {
        // opposite: true,
        title: {
          text: 'Projects',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
}
