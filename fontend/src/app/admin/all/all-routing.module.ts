import { ViewDetailsAllComponent } from "./view-details-all/view-details-all.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "../../authentication/page404/page404.component";
import { AlllistComponent } from "./alllist/alllist.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'alllist', 
        component: AlllistComponent,
      },
      {
        path: 'view/details/all/:id',
        component: ViewDetailsAllComponent,
      },
      
      { path: "**", component: Page404Component },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllRoutingModule {}

