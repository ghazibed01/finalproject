import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TicketRoutingModule } from './ticket-routing.module';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { TicketService } from './services/ticket.service';
import { TicketlistComponent } from './Ticketlist/ticketlist.component';

@NgModule({
  declarations: [
    TicketlistComponent,

   
  ],
  providers: [TicketService],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    TicketRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    NgScrollbarModule,
    MatCheckboxModule,
  ],
})
export class TicketModule {}
