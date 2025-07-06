import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
 
  {
    path: 'rh', 
    loadChildren: () =>
      import('./rh/rh.module').then((m) => m.RhModule),
  },
  {
    path: 'employee', 
    loadChildren: () =>
      import('./employee/employee.module').then((m) => m.EmployeeModule),
  },
  {
    path: 'all', 
    loadChildren: () =>
      import('./all/all.module').then((m) => m.AllModule),
  },
  
  {
    path: 'absence',
    loadChildren: () =>
      import('./absence/absence.module').then((m) => m.AbsenceModule),
  },

  {
    path: 'ticket',
    loadChildren: () =>
      import('./ticket/ticket.module').then((m) => m.TicketModule),
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
