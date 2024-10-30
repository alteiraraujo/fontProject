import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutoComponent } from './produto.component';
import { ProdutoFormComponent } from './produto-form/produto-form.component';
import { ProdutoForm1Component } from '../produto-form1/produto-form1.component';

const routes: Routes = [
  { path: '', component: ProdutoComponent },
  {path: 'novo', component: ProdutoForm1Component },
  {path: 'editar/:id', component: ProdutoForm1Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutoRoutingModule { 
  
}
