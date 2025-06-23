import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { Raca } from './raca';
import { RacaService } from './raca.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RacaFormComponent } from './raca-form/raca-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-raca',
  templateUrl: './raca.component.html',
  styleUrls: ['./raca.component.css'],
  preserveWhitespaces: true,
})
export class RacaComponent implements OnInit {
  racas$: Observable<Raca[]>;
  racasFiltradas$: Observable<Raca[]>;
  private racasSubject = new BehaviorSubject<Raca[]>([]);

  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  especieFilter: string = '';
  statusFilter: string = '';
  carregando = false;

  constructor(
    private service: RacaService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.carregarRacas();
  }

  carregarRacas(): void {
    this.carregando = true;
    this.service.list().subscribe({
      next: (racas) => {
        this.racasSubject.next(racas);
        this.atualizarRacasFiltradas();
        this.carregando = false;
      },
      error: (error) => {
        this.carregando = false;
        this.message.error('Falha ao carregar raças.');
        // Se quiser, pode logar o erro: console.error(error);
      },
    });
    this.racas$ = this.racasSubject.asObservable();
  }

  atualizarRacasFiltradas(): void {
    this.racasFiltradas$ = this.racas$.pipe(
      map((racas) =>
        racas
          .filter(
            (raca) =>
              (this.especieFilter === '' ||
                raca.especie_raca === this.especieFilter) &&
              (this.statusFilter === '' ||
                raca.status_raca === this.statusFilter) &&
              raca.nome_raca
                .toLowerCase()
                .includes(this.searchValue.toLowerCase())
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
    this.atualizarRacasFiltradas();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.atualizarRacasFiltradas();
  }

  onEspecieChange(especie: string): void {
    this.especieFilter = especie;
    this.pageIndex = 1;
    this.atualizarRacasFiltradas();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.atualizarRacasFiltradas();
  }

  toggleStatus(raca: Raca, checked: boolean): void {
    // O valor do switch "checked" ainda NÃO deve alterar nada localmente!
    const novoStatus = checked ? 'Ativo' : 'Inativo';
    // Volta o switch para o valor antigo até confirmação, só se realmente mudou:
    // (resetar o filtro força o switch a voltar visualmente)
    this.atualizarRacasFiltradas();

    this.modal.confirm({
      nzTitle: `Deseja realmente ${
        novoStatus === 'Ativo' ? 'ativar' : 'desativar'
      } esta raça?`,
      nzContent: `A raça será marcada como ${novoStatus}.`,
      nzOkText: novoStatus === 'Ativo' ? 'Ativar' : 'Desativar',
      nzOkType: novoStatus === 'Ativo' ? 'primary' : 'default',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.service.updateStatus(raca.id_raca, novoStatus).subscribe({
          next: () => {
            this.message.success(
              `Raça ${
                novoStatus === 'Ativo' ? 'ativada' : 'desativada'
              } com sucesso!`
            );
            this.carregarRacas(); // Recarrega toda a lista (e atualiza o switch)
          },
          error: () => {
            this.message.error(
              'Não foi possível atualizar o status no servidor.'
            );
            this.carregarRacas();
          },
        });
      },
      nzOnCancel: () => {
        // Sempre recarrega para garantir que o switch volte ao valor correto
        this.carregarRacas();
      },
    });
  }

  abrirModal(modo: 'cadastrar' | 'editar' | 'abrir', raca?: Raca) {
    if (modo === 'editar') {
      this.modal.confirm({
        nzTitle: 'Confirmação',
        nzContent: 'Tem certeza que deseja editar esta raça?',
        nzOkText: 'Sim',
        nzCancelText: 'Não',
        nzOnOk: () => this.abrirFormularioModal(modo, raca),
      });
    } else {
      this.abrirFormularioModal(modo, raca);
    }
  }

  private abrirFormularioModal(
    modo: 'cadastrar' | 'editar' | 'abrir',
    raca?: Raca
  ) {
    const modalRef = this.modal.create({
      nzTitle:
        modo === 'cadastrar'
          ? 'Cadastrar Raça'
          : modo === 'editar'
          ? 'Editar Raça'
          : 'Detalhes da Raça',
      nzContent: RacaFormComponent, // ajuste o caminho do componente
      nzComponentParams: {
        raca,
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
        this.racas$ = this.service.list();
        this.atualizarRacasFiltradas();
      }
    });
  }
}
