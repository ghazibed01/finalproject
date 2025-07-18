import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

import { Page404Component } from '../authentication/page404/page404.component';

const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
  },

  { path: '**', component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule {}
