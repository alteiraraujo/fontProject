import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FornecedorComponent } from './fornecedor.component';
import { FornecedorFormComponent } from './fornecedor-form/fornecedor-form.component';

const routes: Routes = [
{path:'', component: FornecedorComponent},
{path: 'novo', component: FornecedorFormComponent},
{path: 'editar/:id', component: FornecedorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedorRoutingModule { }
