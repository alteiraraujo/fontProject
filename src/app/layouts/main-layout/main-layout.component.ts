import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent {
  isCollapsed = false;
  usuarioLogado: any = null;

  constructor(
    private authService: AuthService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.usuarioLogado = this.authService.getUsuario();
  }

  logout() {
    this.modal.confirm({
      nzTitle: 'Confirmação',
      nzContent: 'Deseja realmente sair do sistema?',
      nzOkText: 'Sim',
      nzCancelText: 'Cancelar',
      nzOnOk: () => this.authService.logout(),
    });
  }

  avatarInicial(usuario: any): string {
    if (!usuario) return '?';
    if (usuario.pessoa && usuario.pessoa.nome_pessoa) {
      // Ex: Maria Silva -> MS
      return usuario.pessoa.nome_pessoa.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (usuario.login_colaborador) {
      return usuario.login_colaborador[0].toUpperCase();
    }
    return '?';
  }
}
