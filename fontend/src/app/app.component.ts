import { Component } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent {
  title: string = 'careplan';
  //icd10s: ICD10[] | undefined;
  currentUrl!: string;
  /*constructor(private icd10service: ICD10Service){
    
  }
 */

  constructor(public _router: Router) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        //empty 
      }
      window.scrollTo(0, 0);
    });
  
   /* ngOnInit() {
      console.log('jdfsjdfks');
      this.icd10service.getAllIcd10ss().subscribe((datas: ICD10[]) => {
        this.icd10s = datas;
      });
    }*/
    
    }}
    

