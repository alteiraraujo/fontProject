import { Component, OnInit } from '@angular/core';
import { Observable, catchError, finalize, map, of } from 'rxjs';
import { Colaborador } from './colaborador';
import { ColaboradorService } from './colaborador.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ColaboradorFormComponent } from './colaborador-form/colaborador-form.component'; // ajuste o caminho se necessário
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-colaborador',
  templateUrl: './colaborador.component.html',
  styleUrls: ['./colaborador.component.css'],
})
export class ColaboradorComponent implements OnInit {
  colaboradores$: Observable<Colaborador[]>;
  colaboradoresFiltrados$: Observable<Colaborador[]>;
  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  statusFilter: string = 'Ativo';
  carregando = false;

  constructor(
    private service: ColaboradorService,
    private modalService: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
  this.carregando = true;
  this.colaboradores$ = this.service.list().pipe(
    finalize(() => this.carregando = false),
    catchError((error) => {
      this.carregando = false;
      this.message.error('Falha ao carregar colaboradores.');
      return of([]);
    })
  );
  this.atualizarColaboradoresFiltrados();
}

  atualizarColaboradoresFiltrados() {
    this.colaboradoresFiltrados$ = this.colaboradores$.pipe(
      map((colaboradores) =>
        colaboradores
          .filter(
            (colaborador) =>
              (this.statusFilter === '' ||
                colaborador.status_colaborador === this.statusFilter) &&
              (colaborador.id_colaborador
                .toString()
                .includes(this.searchValue) ||
                colaborador.nome_colaborador
                  .toLowerCase()
                  .includes(this.searchValue.toLowerCase()))
          )
          .slice(
            (this.pageIndex - 1) * this.pageSize,
            this.pageIndex * this.pageSize
          )
      )
    );
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.atualizarColaboradoresFiltrados();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.atualizarColaboradoresFiltrados();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.atualizarColaboradoresFiltrados();
  }

  abrirModal(
    modo: 'cadastrar' | 'editar' | 'abrir',
    colaborador?: Colaborador
  ) {
    if (modo === 'editar') {
      this.modalService.confirm({
        nzTitle: 'Confirmação',
        nzContent: 'Tem certeza que deseja editar este colaborador?',
        nzOkText: 'Sim',
        nzCancelText: 'Não',
        nzOnOk: () => this.abrirFormularioModal(modo, colaborador),
      });
    } else {
      this.abrirFormularioModal(modo, colaborador);
    }
  }

  // Função responsável por abrir o modal de fato:
  private abrirFormularioModal(
    modo: 'cadastrar' | 'editar' | 'abrir',
    colaborador?: Colaborador
  ) {
    const modalRef = this.modalService.create({
      nzTitle:
        modo === 'cadastrar'
          ? 'Cadastrar Colaborador'
          : modo === 'editar'
          ? 'Editar Colaborador'
          : 'Detalhes do Colaborador',
      nzContent: ColaboradorFormComponent,
      nzComponentParams: {
        colaborador,
        modo,
      },
      nzFooter:
        modo === 'abrir'
          ? [{ label: 'OK', onClick: () => modalRef.close() }]
          : null,
      nzWidth: '600px',
    });

    modalRef.afterClose.subscribe((result) => {
      if (result) {
        this.colaboradores$ = this.service.list();
        this.atualizarColaboradoresFiltrados();
      }
    });
  }

  enviarSenha(colaborador: any): void {
  this.modalService.confirm({
    nzTitle: 'Enviar senha',
    nzContent: `Deseja gerar uma nova senha para o colaborador <b>${colaborador.pessoa.nome_pessoa}</b> e enviá-la por e-mail?`,
    nzOkText: 'Sim',
    nzCancelText: 'Não',
    nzOnOk: () => {
      this.service.enviarSenha(colaborador.id_colaborador).subscribe({
        next: () => this.message.success('Senha enviada para o e-mail do colaborador!'),
        error: () => this.message.error('Erro ao enviar senha.')
      });
    }
  });
}


  toggleStatus(colaborador: Colaborador, checked: boolean): void {
    const novoStatus = checked ? 'Ativo' : 'Inativo';

    // Voltar o switch para o valor antigo até confirmar
    setTimeout(() => {
      // Aqui ele "reverte" visualmente caso o usuário cancele
      colaborador.status_colaborador =
        novoStatus === 'Ativo' ? 'Inativo' : 'Ativo';
      this.atualizarColaboradoresFiltrados();
    });

    this.modalService.confirm({
      nzTitle: `Deseja realmente ${
        novoStatus === 'Ativo' ? 'ativar' : 'desativar'
      } este colaborador?`,
      nzContent: `O colaborador será marcado como ${novoStatus}.`,
      nzOkText: novoStatus === 'Ativo' ? 'Ativar' : 'Desativar',
      nzOkType: novoStatus === 'Ativo' ? 'primary' : 'default',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.service
          .updateStatus(colaborador.id_colaborador, novoStatus)
          .subscribe({
            next: () => {
              colaborador.status_colaborador = novoStatus;
              this.atualizarColaboradoresFiltrados();
              this.message.success(
                `Colaborador ${
                  novoStatus === 'Ativo' ? 'ativado' : 'desativado'
                } com sucesso!`
              );
            },
            error: (error) => {
              this.message.error(
                'Não foi possível atualizar o status no servidor.'
              );
              this.atualizarColaboradoresFiltrados();
            },
          });
      },
      nzOnCancel: () => {
        // Não faz nada, status volta para o valor anterior no setTimeout acima
      },
    });
  }
}
