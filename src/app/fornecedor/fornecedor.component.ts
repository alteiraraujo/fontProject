import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Fornecedor } from './fornecedor';
import { FornecedorService } from './fornecedor.service';

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

  constructor(private service: FornecedorService) {}

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
}
