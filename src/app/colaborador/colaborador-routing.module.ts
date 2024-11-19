import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColaboradorComponent } from './colaborador.component';
import { ColaboradorFormComponent } from './colaborador-form/colaborador-form.component';

const routes: Routes = [
  { path: '', component: ColaboradorComponent },
  { path: 'novo', component: ColaboradorFormComponent },
  { path: 'editar/id', component: ColaboradorFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColaboradorRoutingModule {}
