import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "./../../authentication/page404/page404.component";
import { RhlistComponent } from "./rhlist/rhlist.component"; 
import { ViewDetailsRhComponent } from "./view-details-rh/view-details-rh.component"; 


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'rhlist', 
        component: RhlistComponent,
      },
      {
        path: 'view/details/rh/:id',
        component: ViewDetailsRhComponent,
      },
      
      { path: "**", component: Page404Component },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RhRoutingModule {}

