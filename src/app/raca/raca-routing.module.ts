import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RacaComponent } from './raca.component';


const routes: Routes = [
  {path:'', component: RacaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RacaRoutingModule { }
