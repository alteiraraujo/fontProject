import { Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ColaboradorService } from 'src/app/colaborador/colaborador.service';

@Component({
  selector: 'app-redefinir-senha-modal',
  templateUrl: './redefinir-senha-modal.component.html',
})
export class RedefinirSenhaModalComponent {
  novaSenha = '';
  confirmarSenha = '';
  redefinirSenhaLoading = false;

  erroNovaSenha = '';
  erroConfirmarSenha = '';
  senhaAtual = '';
  erroSenhaAtual = '';

  constructor(
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private service: ColaboradorService
  ) {}

  fechar() {
    this.modalRef.close();
  }

  validate() {
    this.erroSenhaAtual = '';
    this.erroNovaSenha = '';
    this.erroConfirmarSenha = '';

    if (this.senhaAtual && this.senhaAtual.length < 8) {
      this.erroSenhaAtual = 'A senha atual deve ter pelo menos 8 caracteres.';
    }
    if (this.novaSenha && this.novaSenha.length < 8) {
      this.erroNovaSenha = 'A nova senha deve ter pelo menos 8 caracteres.';
    }
    if (this.confirmarSenha && this.confirmarSenha.length < 8) {
      this.erroConfirmarSenha =
        'A confirmação deve ter pelo menos 8 caracteres.';
    }
    if (
      this.novaSenha &&
      this.confirmarSenha &&
      this.novaSenha.length >= 8 &&
      this.confirmarSenha.length >= 8 &&
      this.novaSenha !== this.confirmarSenha
    ) {
      this.erroConfirmarSenha = 'As senhas não coincidem.';
    }
  }

  redefinirSenhaInvalida(): boolean {
    return (
      !this.senhaAtual ||
      this.senhaAtual.length < 8 ||
      !this.novaSenha ||
      this.novaSenha.length < 8 ||
      !this.confirmarSenha ||
      this.confirmarSenha.length < 8 ||
      this.novaSenha !== this.confirmarSenha
    );
  }

  confirmar() {
    this.validate();
    if (this.redefinirSenhaInvalida()) {
      return;
    }

    this.redefinirSenhaLoading = true;

    // Obtenha o ID do colaborador logado (ajuste conforme sua aplicação)
    const idColaborador = JSON.parse(
      localStorage.getItem('token') || '{}'
    ).id_colaborador;
    // Ou passe como Input no modal, caso prefira

    this.service
      .redefinirSenha(idColaborador, this.senhaAtual, this.novaSenha)
      .subscribe({
        next: (res) => {
          this.redefinirSenhaLoading = false;
          this.message.success(res?.message || 'Senha redefinida com sucesso!');
          this.modalRef.close();
        },
        error: (err) => {
          this.redefinirSenhaLoading = false;
          if (typeof err?.error === 'string') {
            this.erroNovaSenha = err.error;
          } else if (
            err?.error &&
            typeof err.error === 'object' &&
            err.error.message
          ) {
            this.erroNovaSenha = err.error.message;
          } else {
            this.erroNovaSenha = 'Erro ao redefinir senha!';
          }
        },
      });
  }
}
