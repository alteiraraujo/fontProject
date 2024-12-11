import { Component, OnInit } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Fornecedor } from './fornecedor';
import { FornecedorService } from './fornecedor.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FornecedorFormComponent } from './fornecedor-form/fornecedor-form.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.css'],
  preserveWhitespaces: true
})
export class FornecedorComponent implements OnInit {
  fornecedores$: Observable<Fornecedor[]>;
  fornecedoresFiltrados$: Observable<Fornecedor[]>;
  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  statusFilter: string = 'Ativo';

  constructor(
    private service: FornecedorService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.fornecedores$ = this.service.list();
    this.atualizarFornecedoresFiltrados();
  }

  atualizarFornecedoresFiltrados() {
    this.fornecedoresFiltrados$ = this.fornecedores$.pipe(
      map((fornecedores) =>
        fornecedores
          .filter(
            (fornecedor) =>
              (this.statusFilter === '' || fornecedor.status_fornecedor === this.statusFilter) &&
              (fornecedor.id_fornecedor?.toString().includes(this.searchValue) ||
                fornecedor.nome_fornecedor.toLowerCase().includes(this.searchValue.toLowerCase()))
          )
          .slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
      )
    );
  }

  carregarFornecedores(): void {
    this.fornecedores$ = this.service.list().pipe(
      catchError((error) => {
        console.error('Erro ao carregar fornecedores:', error);
        this.notification.error('Erro', 'Falha ao carregar fornecedores.');
        return of([]);
      })
    );
    this.atualizarFornecedoresFiltrados();
  }
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.atualizarFornecedoresFiltrados();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.atualizarFornecedoresFiltrados();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.atualizarFornecedoresFiltrados();
  }

  // Método para alternar o status do fornecedor
  toggleStatus(fornecedor: Fornecedor): void {
    const novoStatus = fornecedor.status_fornecedor === 'Ativo' ? 'Inativo' : 'Ativo';
    const confirmacao = confirm(`Deseja realmente ${novoStatus === 'Ativo' ? 'ativar' : 'desativar'} este fornecedor?`);

    if (confirmacao) {
      this.service.updateStatus(fornecedor.id_fornecedor!, novoStatus).subscribe({
        next: () => {
          fornecedor.status_fornecedor = novoStatus;
          this.atualizarFornecedoresFiltrados();
          console.log("Status atualizado com sucesso no backend.");
        },
        error: (error) => {
          console.error("Erro ao atualizar status no backend:", error);
          alert("Não foi possível atualizar o status no servidor.");
        }
      });
    }
  }
  abrirModal(modo: 'cadastrar' | 'editar' | 'abrir', fornecedor?: Fornecedor): void {
    if (modo === 'editar') {
      this.modal.confirm({
        nzTitle: 'Confirmação',
        nzContent: 'Tem certeza que deseja editar este fornecedor?',
        nzOkText: 'Sim',
        nzCancelText: 'Não',
        nzOnOk: () => this.abrirFormularioModal(modo, fornecedor),
      });
    } else {
      this.abrirFormularioModal(modo, fornecedor);
    }
  }

  private abrirFormularioModal(modo: 'cadastrar' | 'editar' | 'abrir', fornecedor?: Fornecedor): void {
    const modalRef = this.modal.create({
      nzTitle:
        modo === 'cadastrar'
          ? 'Cadastrar Fornecedor'
          : modo === 'editar'
          ? 'Editar Fornecedor'
          : 'Detalhes do Fornecedor',
      nzContent: FornecedorFormComponent,
      nzComponentParams: {
        fornecedor: fornecedor ? { ...fornecedor } : undefined,
        modo: modo,
      },
      nzFooter: modo === 'abrir' ? [{ label: 'Ok', onClick: () => modalRef.close() }] : null,
      nzWidth: '600px',
    });

    modalRef.afterClose.subscribe((resultado?: Fornecedor) => {
      if (resultado && modo === 'editar') {
        this.carregarFornecedores(); // Atualiza a lista
      } else if (resultado && modo === 'cadastrar') {
        this.onNovoFornecedor(resultado);
      }
    });
  }

  onNovoFornecedor(novoFornecedor: Fornecedor): void {
    this.service.create(novoFornecedor).subscribe({
      next: () => {
        this.notification.success('Sucesso', 'Fornecedor cadastrado com sucesso!');
        this.carregarFornecedores();
      },
      error: (error) => {
        console.error('Erro ao cadastrar fornecedor:', error);
        this.notification.error('Erro', 'Falha ao cadastrar fornecedor.');
      },
    });
  }


}
