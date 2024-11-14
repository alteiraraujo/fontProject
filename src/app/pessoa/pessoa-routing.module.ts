import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PessoaComponent } from './pessoa.component';
import { PessoaFormComponent } from './pessoa-form/pessoa-form.component';

const routes: Routes = [
  { path: '', component: PessoaComponent },             // Rota principal
  { path: 'novo', component: PessoaFormComponent },     // Rota para criar nova pessoa
  { path: 'editar/:id', component: PessoaFormComponent } // Rota para editar uma pessoa
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PessoaRoutingModule { }
