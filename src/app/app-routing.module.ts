import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'produtos', loadChildren: () => import('./produto/produto.module').then(m => m.ProdutoModule) },
      { path: 'pessoas', loadChildren: () => import('./pessoa/pessoa.module').then(m => m.PessoaModule) },
      { path: 'animais', loadChildren: () => import('./animal/animal.module').then(m => m.AnimalModule) },
      { path: 'colaboradores', loadChildren: () => import('./colaborador/colaborador.module').then(m => m.ColaboradorModule) },
      { path: 'categorias', loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule) },
      { path: 'fornecedores', loadChildren: () => import('./fornecedor/fornecedor.module').then(m => m.FornecedorModule) },
      { path: 'agendamentos', loadChildren: () => import('./agendamento/agendamento.module').then(m => m.AgendamentoModule) },
      { path: 'servicos', loadChildren: () => import('./servico/servico.module').then(m => m.ServicoModule) },
      { path: 'diagnosticos', loadChildren: () => import('./diagnostico/diagnostico.module').then(m => m.DiagnosticoModule) },
      { path: 'racas', loadChildren: () => import('./raca/raca.module').then(m => m.RacaModule) },
      { path: '', redirectTo: 'pessoas', pathMatch: 'full' },
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent, 
    children: [
      { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
