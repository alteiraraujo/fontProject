import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Animal } from './animal';
import { AnimalService } from './animal.service';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css'],
  preserveWhitespaces: true
})
export class AnimalComponent implements OnInit {
  animais$: Observable<Animal[]>;
  animaisFiltrados$: Observable<Animal[]>;
  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  statusFilter: string = 'Ativo';

  constructor(private service: AnimalService) {}

  ngOnInit() {
    this.animais$ = this.service.list();
    this.AtualizarAnimaisFiltrados();
  }
  AtualizarAnimaisFiltrados() {
    this.animaisFiltrados$ = this.animais$.pipe(
      map((animais) =>
        animais
          .filter(
            (animal) =>
              (this.statusFilter === '' ||
                animal.status_animal === this.statusFilter) &&
              animal.nome_animal.toString().includes(this.searchValue)
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
    this.AtualizarAnimaisFiltrados();
  }

  onSearchChange(): void {
    this.AtualizarAnimaisFiltrados();
  }
  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.AtualizarAnimaisFiltrados();
  }

  toggleStatus(animal: Animal): void {
    const novoStatus = animal.status_animal === 'Ativo' ? 'Inativo' : 'Ativo';
    const confirmacao = confirm(`Deseja realmente ${novoStatus === 'Ativo' ? 'ativar' : 'desativar'} este animal?`);
  
    if (confirmacao) {
      this.service.updateStatus(animal.id_animal, novoStatus).subscribe({
        next: () => {
          animal.status_animal = novoStatus;
          this.AtualizarAnimaisFiltrados();
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
