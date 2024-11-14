import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //{ path: '', pathMatch: 'full', redirectTo: '/welcome' },
  //{ path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'Produto', loadChildren: () => import('./produto/produto.module').then(m => m.ProdutoModule) },
  { path: 'pessoas', loadChildren: () => import('./pessoa/pessoa.module').then(m => m.PessoaModule) },
  { path: '', redirectTo: '/pessoas', pathMatch: 'full' },
  { path: 'Animal', loadChildren: () => import('./animal/animal.module').then(m => m.AnimalModule) },
  { path: 'Colaborador', loadChildren: () => import('./colaborador/colaborador.module').then(m => m.ColaboradorModule) },
  { path: 'Categoria', loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule) },
  { path: 'fornecedores', loadChildren: () => import('./fornecedor/fornecedor.module').then(m => m.FornecedorModule) },
  { path: 'Agendamento', loadChildren: () => import('./agendamento/agendamento.module').then(m => m.AgendamentoModule) },
  { path: 'Servico', loadChildren: () => import('./servico/servico.module').then(m => m.ServicoModule) },
  { path: 'Diagnostico', loadChildren: () => import('./diagnostico/diagnostico.module').then(m => m.DiagnosticoModule) },
  { path: 'Login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
