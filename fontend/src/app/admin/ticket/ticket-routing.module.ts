import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "../../authentication/page404/page404.component";
import { TicketlistComponent } from "./Ticketlist/ticketlist.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ticketlist', 
        component: TicketlistComponent,
      }, 
      { path: "**", component: Page404Component },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketRoutingModule {}

