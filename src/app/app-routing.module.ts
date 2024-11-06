import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //{ path: '', pathMatch: 'full', redirectTo: '/welcome' },
  //{ path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'Produto', loadChildren: () => import('./produto/produto.module').then(m => m.ProdutoModule) },
  { path: 'Pessoa', loadChildren: () => import('./pessoa/pessoa.module').then(m => m.PessoaModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
