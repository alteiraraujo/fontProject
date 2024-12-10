import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Animal } from './animal';
import { AnimalService } from './animal.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AnimalFormComponent } from './animal-form/animal-form.component';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css'],
  preserveWhitespaces: true,
})
export class AnimalComponent implements OnInit {
  animais$: Observable<Animal[]>;
  animaisFiltrados$: Observable<Animal[]>;
  private animaisSubject = new BehaviorSubject<Animal[]>([]);

  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  statusFilter: string = 'Ativo';

  constructor(private service: AnimalService, private modal: NzModalService) {}

  ngOnInit() {
    this.carregarAnimais();
  }

  carregarAnimais(): void {
    this.service.list().subscribe((animais) => {
      this.animaisSubject.next(animais);
      this.AtualizarAnimaisFiltrados();
    });
    this.animais$ = this.animaisSubject.asObservable();
  }

  AtualizarAnimaisFiltrados(): void {
    this.animaisFiltrados$ = this.animais$.pipe(
      map((animais) =>
        animais
          .filter(
            (animal) =>
              (this.statusFilter === '' ||
                animal.status_animal === this.statusFilter) &&
              animal.nome_animal
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
    this.AtualizarAnimaisFiltrados();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.AtualizarAnimaisFiltrados();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.AtualizarAnimaisFiltrados();
  }

  toggleStatus(animal: Animal): void {
    const novoStatus = animal.status_animal === 'Ativo' ? 'Inativo' : 'Ativo';
    const confirmacao = confirm(
      `Deseja realmente ${
        novoStatus === 'Ativo' ? 'ativar' : 'desativar'
      } este animal?`
    );

    if (confirmacao) {
      this.service.updateStatus(animal.id_animal, novoStatus).subscribe({
        next: () => {
          animal.status_animal = novoStatus;
          this.carregarAnimais(); // Recarrega a lista após a alteração de status
          console.log('Status atualizado com sucesso no backend.');
        },
        error: (error) => {
          console.error('Erro ao atualizar status no backend:', error);
          alert('Não foi possível atualizar o status no servidor.');
        },
      });
    }
  }

  fecharModal(): void {
    this.modal.closeAll(); // Fecha o modal
  }

  abrirModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cadastrar Animal',
      nzContent: AnimalFormComponent,
      nzFooter: null,
      nzWidth: '600px',
    });
  
    const instance = modalRef.getContentComponent() as AnimalFormComponent;
  
    instance.animalCadastrado.subscribe((novoAnimal: Animal) => {
      this.carregarAnimais(); // Atualiza a tabela de animais
      modalRef.close();
    });
  
    instance.cancelado.subscribe(() => {
      modalRef.close(); // Fecha o modal ao cancelar
    });
  }
  
}
