import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { Page404Component } from './authentication/page404/page404.component';
import { AuthGuard } from './core/guard/auth.guard';
import { Role } from './core/models/role';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
      {
        path: 'admin',
        canActivate: [AuthGuard],
          data: { role: ['Manager'] } ,
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      
      
   

      {
        path: 'calendar',
        loadChildren: () =>
          import('./calendar/calendar.module').then((m) => m.CalendarsModule),
      },
      {
        path: 'employee',
        loadChildren: () =>
          import('./employee/employee.module').then((m) => m.EmployeeModule),
      },


      {
        path: 'apps',
        loadChildren: () =>
          import('./apps/apps.module').then((m) => m.AppsModule),
      },
  
    ],
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: '**', component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {
   constructor(private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

}
