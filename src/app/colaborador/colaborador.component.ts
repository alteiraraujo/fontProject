import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Colaborador } from './colaborador';
import { ColaboradorService } from './colaborador.service';

@Component({
  selector: 'app-colaborador',
  templateUrl: './colaborador.component.html',
  styleUrls: ['./colaborador.component.css']
})

export class ColaboradorComponent implements OnInit {
  colaboradores$: Observable<Colaborador[]>;
  colaboradoresFiltrados$: Observable<Colaborador[]>;
  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  statusFilter: string = 'Ativo';

  constructor(private service: ColaboradorService) {}

  ngOnInit() {
    this.colaboradores$ = this.service.list();
    this.atualizarColaboradoresFiltrados();
  }

  atualizarColaboradoresFiltrados() {
    this.colaboradoresFiltrados$ = this.colaboradores$.pipe(
      map((colaboradores) =>
        colaboradores
          .filter(
            (colaborador) =>
              (this.statusFilter === '' || colaborador.status_colaborador === this.statusFilter) &&
              (colaborador.id_colaborador.toString().includes(this.searchValue) ||
                colaborador.nome_colaborador.toLowerCase().includes(this.searchValue.toLowerCase()))
          )
          .slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
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

  // Método para alternar o status do colaborador
  toggleStatus(colaborador: Colaborador): void {
    const novoStatus = colaborador.status_colaborador === 'Ativo' ? 'Inativo' : 'Ativo';
    const confirmacao = confirm(`Deseja realmente ${novoStatus === 'Ativo' ? 'ativar' : 'desativar'} este colaborador?`);

    if (confirmacao) {
      this.service.updateStatus(colaborador.id_colaborador, novoStatus).subscribe({
        next: () => {
          colaborador.status_colaborador = novoStatus;
          this.atualizarColaboradoresFiltrados();
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
