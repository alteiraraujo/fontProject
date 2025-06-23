import { Component, OnInit } from '@angular/core';
import { Observable, map, catchError, of, finalize } from 'rxjs';
import { Pessoa } from './pessoa';
import { PessoaService } from './pessoa.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PessoaFormComponent } from './pessoa-form/pessoa-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-pessoa',
  templateUrl: './pessoa.component.html',
  styleUrls: ['./pessoa.component.css'],
})
export class PessoaComponent implements OnInit {
  pessoas$: Observable<Pessoa[]>;
  pessoasFiltradas$: Observable<Pessoa[]>;
  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  statusFilter: string = 'Ativo';
  carregando = false;

  constructor(
    private service: PessoaService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.carregarPessoas();
  }

carregarPessoas(): void {
  this.carregando = true;

  this.pessoas$ = this.service.list().pipe(
    finalize(() => this.carregando = false), // desliga o loading sempre (sucesso ou erro)
    catchError((error) => {
      console.error('Erro ao carregar pessoas:', error);
      this.message.error('Falha ao carregar pessoas.');
      return of([]);
    })
  );

  this.atualizarPessoasFiltradas();
}

  atualizarPessoasFiltradas(): void {
    this.pessoasFiltradas$ = this.pessoas$.pipe(
      map((pessoas) =>
        pessoas
          .filter(
            (pessoa) =>
              (this.statusFilter === '' ||
                pessoa.status_pessoa === this.statusFilter) &&
              pessoa.nome_pessoa
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
    this.atualizarPessoasFiltradas();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.atualizarPessoasFiltradas();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.atualizarPessoasFiltradas();
  }

  toggleStatus(pessoa: Pessoa): void {
    const novoStatus = pessoa.status_pessoa === 'Ativo' ? 'Inativo' : 'Ativo';

    this.modal.confirm({
      nzTitle: 'Confirmação',
      nzContent: `Deseja realmente ${
        novoStatus === 'Ativo' ? 'ativar' : 'desativar'
      } esta pessoa?`,
      nzOkText: 'Sim',
      nzOkType: 'primary',
      nzOnOk: () =>
        this.service.updateStatus(pessoa.id_pessoa!, novoStatus).subscribe({
          next: () => {
            pessoa.status_pessoa = novoStatus; // Atualiza o status localmente
            this.message.success(
              `Status da pessoa atualizado para ${novoStatus}.`
            );
            this.atualizarPessoasFiltradas();
          },
          error: (error) => {
            console.error('Erro ao atualizar status no backend:', error);
            this.message.error(
              'Falha ao tentar atualizar o status.'
            );
          },
        }),
      nzCancelText: 'Não',
    });
  }

  abrirModal(modo: 'cadastrar' | 'editar' | 'abrir', pessoa?: Pessoa): void {
    if (modo === 'editar') {
      this.modal.confirm({
        nzTitle: 'Confirmação',
        nzContent: 'Tem certeza que deseja editar esta pessoa?',
        nzOkText: 'Sim',
        nzCancelText: 'Não',
        nzOnOk: () => this.abrirFormularioModal(modo, pessoa),
      });
    } else {
      this.abrirFormularioModal(modo, pessoa);
    }
  }

  private abrirFormularioModal(
    modo: 'cadastrar' | 'editar' | 'abrir',
    pessoa?: Pessoa
  ): void {
    const modalRef = this.modal.create({
      nzTitle:
        modo === 'cadastrar'
          ? 'Cadastrar Pessoa'
          : modo === 'editar'
          ? 'Editar Pessoa'
          : 'Detalhes da Pessoa',
      nzContent: PessoaFormComponent,
      nzComponentParams: {
        pessoa: pessoa ? { ...pessoa } : undefined,
        modo: modo,
      },
      nzFooter:
        modo === 'abrir'
          ? [{ label: 'Ok', onClick: () => modalRef.close() }]
          : null,
      nzWidth: '600px',
    });

    modalRef.afterClose.subscribe((resultado?: Pessoa) => {
      if (resultado && modo === 'editar') {
        this.carregarPessoas(); // Atualiza a lista
      } else if (resultado && modo === 'cadastrar') {
        this.onNovaPessoa(resultado);
      }
    });
  }

  onNovaPessoa(novaPessoa: Pessoa): void {
    this.service.create(novaPessoa).subscribe({
      next: () => {
        this.message.success('Pessoa cadastrada com sucesso!');
        this.carregarPessoas();
      },
      error: (error) => {
        console.error('Erro ao cadastrar pessoa:', error);
        this.message.error('Falha ao cadastrar pessoa.');
      },
    });
  }
}
