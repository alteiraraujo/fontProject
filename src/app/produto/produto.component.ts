import { Component, OnInit } from '@angular/core';
import { Observable, catchError, finalize, map, of } from 'rxjs';
import { Produto } from './produto';
import { ProdutosService } from './produtos.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProdutoFormComponent } from './produto-form/produto-form.component'; // ajuste o caminho se necessário
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
  preserveWhitespaces: true,
})
export class ProdutoComponent implements OnInit {
  produtos$: Observable<Produto[]>;
  produtosFiltrados$: Observable<Produto[]>;
  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  statusFilter: string = 'Ativo';
  carregando = false;

  constructor(
    private service: ProdutosService,
    private modalService: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.carregando = true;
    this.produtos$ = this.service.list().pipe(
      finalize(() => (this.carregando = false)),
      catchError((error) => {
        this.carregando = false;
        this.message.error('Falha ao carregar produtos.');
        return of([]);
      })
    );
    this.atualizarProdutosFiltrados();
  }

  atualizarProdutosFiltrados() {
    this.produtosFiltrados$ = this.produtos$.pipe(
      map((produtos) =>
        produtos
          .filter(
            (produto) =>
              (this.statusFilter === '' ||
                produto.status_produto === this.statusFilter) &&
              (produto.cod_produto.toString().includes(this.searchValue) ||
                produto.desc_produto
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
    this.atualizarProdutosFiltrados();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.atualizarProdutosFiltrados();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.atualizarProdutosFiltrados();
  }

  // Método para alternar o status do produto
  toggleStatus(produto: Produto, checked: boolean): void {
    // checked = true (ativar), false (inativar)
    const novoStatus = checked ? 'Ativo' : 'Inativo';

    // Reverte o visual do switch até o usuário confirmar
    setTimeout(() => {
      // Volta para o valor anterior até a confirmação
      produto.status_produto = novoStatus === 'Ativo' ? 'Inativo' : 'Ativo';
      this.atualizarProdutosFiltrados();
    });

    this.modalService.confirm({
      nzTitle: `Deseja realmente ${
        novoStatus === 'Ativo' ? 'ativar' : 'desativar'
      } este produto?`,
      nzContent: `O produto será marcado como ${novoStatus}.`,
      nzOkText: novoStatus === 'Ativo' ? 'Ativar' : 'Desativar',
      nzOkType: novoStatus === 'Ativo' ? 'primary' : 'default',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.service.updateStatus(produto.id_produto, novoStatus).subscribe({
          next: () => {
            produto.status_produto = novoStatus;
            this.atualizarProdutosFiltrados();
            this.message.success(
              `Produto ${
                novoStatus === 'Ativo' ? 'ativado' : 'desativado'
              } com sucesso!`
            );
          },
          error: (error) => {
            this.message.error(
              'Não foi possível atualizar o status no servidor.'
            );
            this.atualizarProdutosFiltrados();
          },
        });
      },
      nzOnCancel: () => {
        // O switch fica no valor original graças ao setTimeout acima.
      },
    });
  }

  abrirModal(modo: 'cadastrar' | 'editar' | 'abrir', produto?: Produto) {
    if (modo === 'editar') {
      this.modalService.confirm({
        nzTitle: 'Confirmação',
        nzContent: 'Tem certeza que deseja editar este produto?',
        nzOkText: 'Sim',
        nzCancelText: 'Não',
        nzOnOk: () => this.abrirFormularioModal(modo, produto),
      });
    } else {
      this.abrirFormularioModal(modo, produto);
    }
  }

  // Função privada que abre realmente o modal
  private abrirFormularioModal(
    modo: 'cadastrar' | 'editar' | 'abrir',
    produto?: Produto
  ) {
    const modalRef = this.modalService.create({
      nzTitle:
        modo === 'cadastrar'
          ? 'Cadastrar Produto'
          : modo === 'editar'
          ? 'Editar Produto'
          : 'Detalhes do Produto',
      nzContent: ProdutoFormComponent,
      nzComponentParams: {
        produto,
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
        this.produtos$ = this.service.list();
        this.atualizarProdutosFiltrados();
      }
    });
  }
}
