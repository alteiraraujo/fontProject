import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteComponent } from './cliente.component';
import { ClienteDashboardComponent } from './Paginas/cliente-dashboard/cliente-dashboard.component';


@NgModule({
  declarations: [
    ClienteComponent,
    ClienteDashboardComponent
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule
  ]
})
export class ClienteModule { }
