import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Produto } from './produto';
import { ProdutosService } from './produtos.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
  preserveWhitespaces: true
})
export class ProdutoComponent implements OnInit {
  produtos$: Observable<Produto[]>;
  produtosFiltrados$: Observable<Produto[]>;
  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  statusFilter: string = 'Ativo';

  constructor(private service: ProdutosService) {}

  ngOnInit() {
    this.produtos$ = this.service.list();
    this.atualizarProdutosFiltrados();
  }

  atualizarProdutosFiltrados() {
    this.produtosFiltrados$ = this.produtos$.pipe(
      map((produtos) =>
        produtos
          .filter(
            (produto) =>
              (this.statusFilter === '' || produto.status_produto === this.statusFilter) &&
              (produto.cod_produto.toString().includes(this.searchValue) ||
                produto.desc_produto.toLowerCase().includes(this.searchValue.toLowerCase()))
          )
          .slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
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
  toggleStatus(produto: Produto): void {
    const novoStatus = produto.status_produto === 'Ativo' ? 'Inativo' : 'Ativo';
    const confirmacao = confirm(`Deseja realmente ${novoStatus === 'Ativo' ? 'ativar' : 'desativar'} este produto?`);
  
    if (confirmacao) {
      this.service.updateStatus(produto.id_produto, novoStatus).subscribe({
        next: () => {
          produto.status_produto = novoStatus;
          this.atualizarProdutosFiltrados();
          console.log("Status atualizado com sucesso no backend.");
        },
        error: (error) => {
          console.error("Erro ao atualizar status no backend:", error);
          alert("Não foi possível atualizar o status no servidor.");
        }
      });
    }
  }
}
