import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupClientComponent } from './basica/componentes/signup-client/signup-client.component';
import { LoginComponent } from './basica/componentes/login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'Produto', loadChildren: () => import('./produto/produto.module').then(m => m.ProdutoModule) },
  { path: 'Cliente', loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule) },
  {path: 'register_client', component: SignupClientComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
