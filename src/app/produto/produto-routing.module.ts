import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutoComponent } from './produto.component';
import { ProdutoFormComponent } from './produto-form/produto-form.component';



const routes: Routes = [
  { path: '', component: ProdutoComponent },
  {path: 'novo', component: ProdutoFormComponent},
  {path: 'editar/:id', component: ProdutoFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutoRoutingModule { 
  
}
