import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Categoria } from './categoria';
import { CategoriaService } from './categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})

export class CategoriaComponent implements OnInit {
  categorias$: Observable<Categoria[]>;
  categoriasFiltradas$: Observable<Categoria[]>;
  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  statusFilter: string = 'Ativo';

  constructor(private service: CategoriaService) {}

  ngOnInit() {
    this.categorias$ = this.service.list();
    this.atualizarCategoriasFiltradas();
  }

  atualizarCategoriasFiltradas() {
    this.categoriasFiltradas$ = this.categorias$.pipe(
      map((categorias) =>
        categorias
          .filter(
            (categoria) =>
              (this.statusFilter === '' || categoria.status_categoria === this.statusFilter) &&
              (categoria.id_categoria?.toString().includes(this.searchValue) ||
                categoria.nome_categoria.toLowerCase().includes(this.searchValue.toLowerCase()))
          )
          .slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
      )
    );
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.atualizarCategoriasFiltradas();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.atualizarCategoriasFiltradas();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.atualizarCategoriasFiltradas();
  }

  // Método para alternar o status da categoria
  toggleStatus(categoria: Categoria): void {
    const novoStatus = categoria.status_categoria === 'Ativo' ? 'Inativo' : 'Ativo';
    const confirmacao = confirm(`Deseja realmente ${novoStatus === 'Ativo' ? 'ativar' : 'desativar'} esta categoria?`);

    if (confirmacao) {
      this.service.updateStatus(categoria.id_categoria!, novoStatus).subscribe({
        next: () => {
          categoria.status_categoria = novoStatus;
          this.atualizarCategoriasFiltradas();
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
