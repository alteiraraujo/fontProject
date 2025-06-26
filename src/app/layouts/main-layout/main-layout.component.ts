import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RedefinirSenhaModalComponent } from '../../login/redefinir-senha-modal/redefinir-senha-modal.component';

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
      return usuario.pessoa.nome_pessoa
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    if (usuario.login_colaborador) {
      return usuario.login_colaborador[0].toUpperCase();
    }
    return '?';
  }

  redefinirSenhaModalAberto = false;
  redefinirSenhaLoading = false;
  novaSenha: string = '';
  confirmarSenha: string = '';
  erroSenha: string = '';

  abrirRedefinirSenha() {
    this.modal.create({
      nzTitle: 'Redefinir senha',
      nzContent: RedefinirSenhaModalComponent,
      nzFooter: null, // ou adicione botões personalizados aqui se quiser
    });
  }
  
  fecharRedefinirSenhaModal() {
    this.redefinirSenhaModalAberto = false;
  }
  redefinirSenhaInvalida(): boolean {
    return (
      !this.novaSenha ||
      !this.confirmarSenha ||
      this.novaSenha.length < 6 ||
      this.novaSenha !== this.confirmarSenha
    );
  }
  confirmarRedefinicaoSenha() {
    this.erroSenha = '';
    if (this.novaSenha !== this.confirmarSenha) {
      this.erroSenha = 'As senhas não coincidem!';
      return;
    }
    if (!this.novaSenha || this.novaSenha.length < 6) {
      this.erroSenha = 'A senha deve ter pelo menos 6 caracteres!';
      return;
    }

    this.redefinirSenhaLoading = true;

    // Simula chamada ao serviço
    setTimeout(() => {
      this.redefinirSenhaLoading = false;
      this.fecharRedefinirSenhaModal();
      // Feedback de sucesso pode ser adicionado aqui
    }, 1500);
  }
}
