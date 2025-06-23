import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Animal } from './animal';
import { AnimalService } from './animal.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AnimalFormComponent } from './animal-form/animal-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  carregando = false;

  constructor(
    private service: AnimalService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.carregarAnimais();
  }

  carregarAnimais(): void {
    this.carregando = true; // Ativa o spin

    this.service.list().subscribe({
      next: (animais) => {
        this.animaisSubject.next(animais);
        this.AtualizarAnimaisFiltrados();
        this.carregando = false; // Desativa só depois de carregar!
      },
      error: () => {
        this.carregando = false; // Desativa mesmo se der erro!
      },
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

    this.modal.confirm({
      nzTitle: 'Confirmação',
      nzContent: `Deseja realmente ${
        novoStatus === 'Ativo' ? 'ativar' : 'desativar'
      } este animal?`,
      nzOkText: 'Sim',
      nzOkType: 'primary',
      nzOnOk: () =>
        this.service.updateStatus(animal.id_animal, novoStatus).subscribe({
          next: () => {
            this.carregarAnimais(); // Atualiza os dados da tabela após a alteração
            this.message.success(
              `Status do animal atualizado para ${novoStatus}.`
            );
          },
          error: (error) => {
            console.error('Erro ao atualizar status no backend:', error);
            this.message.error('Erro ao tentar atualizar o status do animal.');
          },
        }),
      nzCancelText: 'Não',
      nzOnCancel: () => {
        this.message.info('Ação de alteração de status foi cancelada.');
      },
    });
  }

  fecharModal(): void {
    this.modal.closeAll(); // Fecha o modal
  }

  abrirModal(modo: 'cadastrar' | 'editar' | 'abrir', animal?: Animal): void {
    if (modo === 'editar') {
      this.modal.confirm({
        nzTitle: 'Confirmação',
        nzContent: 'Tem certeza que deseja editar este animal?',
        nzOkText: 'Sim',
        nzCancelText: 'Não',
        nzOnOk: () => this.abrirFormularioModal(modo, animal), // Confirmação para abrir o modal de edição
      });
    } else {
      this.abrirFormularioModal(modo, animal);
    }
  }

  private abrirFormularioModal(
    modo: 'cadastrar' | 'editar' | 'abrir',
    animal?: Animal
  ): void {
    const modalRef = this.modal.create({
      nzTitle:
        modo === 'cadastrar'
          ? 'Cadastrar Animal'
          : modo === 'editar'
          ? 'Editar Animal'
          : 'Detalhes do Animal',
      nzContent: AnimalFormComponent,
      nzComponentParams: {
        animal: animal ? { ...animal } : undefined, // Garante que os dados do animal sejam passados
        modo: modo,
      },
      nzFooter:
        modo === 'abrir'
          ? [{ label: 'Ok', onClick: () => modalRef.close() }]
          : null,
      nzWidth: '600px',
    });

    modalRef.afterClose.subscribe((resultado?: Animal) => {
      if (resultado) {
        if (modo === 'editar') {
          this.service.update(resultado.id_animal!, resultado).subscribe({
            next: () => {
              this.carregarAnimais(); // Atualiza a lista após edição
            },
            error: (error) => {
              console.error('Erro ao atualizar animal:', error);
              this.message.error('Erro ao atualizar o animal.');
            },
          });
        } else if (modo === 'cadastrar') {
          this.onNovoAnimal(resultado); // Lida com o cadastro de novos animais
        }
      }
    });
  }

  onNovoAnimal(novoAnimal: Animal): void {
    novoAnimal.status_animal = 'Ativo';
    this.service.create(novoAnimal).subscribe({
      next: () => {
        alert('Animal cadastrado com sucesso!');
        this.carregarAnimais();
      },
      error: (error) => {
        console.error('Erro ao cadastrar animal:', error);
        alert('Erro ao cadastrar o animal.');
      },
    });
  }
}
