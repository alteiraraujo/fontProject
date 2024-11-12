import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagnosticoComponent } from './diagnostico.component';

const routes: Routes = [
  {path:'', component: DiagnosticoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagnosticoRoutingModule { }
