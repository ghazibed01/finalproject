import { formatDate } from '@angular/common';
export class Calendar {
  id!: any;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  details: string;
  userId!: number;
  userEmail!: string;
  userName!: string;

  constructor(calendar: Partial<Calendar> = {}) {  // Use Partial<Calendar> for flexibility
  
    this.title = calendar.title || '';
    this.category = calendar.category || '';
    this.startDate = calendar.startDate ? formatDate(calendar.startDate, 'yyyy-MM-dd', 'en') : formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.endDate = calendar.endDate ? formatDate(calendar.endDate, 'yyyy-MM-dd', 'en') : formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.details = calendar.details || '';
    this.userId = calendar.userId ?? calendar.userId ?? 0;
  }
 
}
