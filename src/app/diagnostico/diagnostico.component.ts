import { Component, OnInit } from '@angular/core';
import { DiagnosticoService } from './diagnostico.service';
import { Diagnostico } from './diagnostico';
import { Observable, map, combineLatest, of } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DiagnosticoFormComponent } from './diagnostico-form/diagnostico-form.component';
import { AnimalService } from '../animal/animal.service';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.component.html',
  styleUrls: ['./diagnostico.component.css'],
})
export class DiagnosticoComponent implements OnInit {
  diagnosticos$: Observable<Diagnostico[]>;
  diagnosticosFiltrados$: Observable<Diagnostico[]>;
  animais$: Observable<any[]>; // Sempre utilize o tipo correto se tiver
  pageIndex = 1;
  pageSize = 8;
  searchValue = '';
  carregando = true;
  statusFilter: string = '';

  constructor(
    private service: DiagnosticoService,
    private animalService: AnimalService,
    private modalService: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.carregando = true;

    this.diagnosticos$ = this.service.list();
    this.animais$ = this.animalService.list();

    // Só libera o spin quando ambos tiverem carregado!
    combineLatest([this.diagnosticos$, this.animais$]).subscribe({
      next: () => {
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.message.error('Falha ao carregar dados.');
      },
    });

    this.atualizarDiagnosticosFiltrados();
  }

  atualizarDiagnosticosFiltrados() {
    // Une diagnósticos e animais para o filtro por nome do animal
    this.diagnosticosFiltrados$ = combineLatest([
      this.diagnosticos$,
      this.animais$,
    ]).pipe(
      map(([diagnosticos, animais]) =>
        diagnosticos
          .filter((diag) => {
            const nomeAnimal =
              diag.animal?.nome_animal ||
              animais.find((a) => a.id_animal === diag.animal?.id_animal)
                ?.nome_animal ||
              '';
            // Filtro por animal e status
            const passaNome =
              !this.searchValue ||
              nomeAnimal.toLowerCase().includes(this.searchValue.toLowerCase());
            const passaStatus =
              !this.statusFilter ||
              diag.status_diagnostico === this.statusFilter;
            return passaNome && passaStatus;
          })
          .slice(
            (this.pageIndex - 1) * this.pageSize,
            this.pageIndex * this.pageSize
          )
      )
    );
  }

  toggleStatus(diagnostico: Diagnostico): void {
    const novoStatus =
      diagnostico.status_diagnostico === 'Ativo' ? 'Inativo' : 'Ativo';

    this.modalService.confirm({
      nzTitle: 'Confirmação',
      nzContent: `Deseja realmente ${
        novoStatus === 'Ativo' ? 'ativar' : 'inativar'
      } este diagnóstico?`,
      nzOkText: 'Sim',
      nzOkType: 'primary',
      nzOnOk: () =>
        this.service
          .updateStatus(diagnostico.id_diagnostico, novoStatus)
          .subscribe({
            next: () => {
              this.diagnosticos$ = this.service.list();
              this.atualizarDiagnosticosFiltrados();
              this.message.success(
                `Status do diagnóstico atualizado para ${novoStatus}.`
              );
            },
            error: (error) => {
              this.message.error(
                'Erro ao tentar atualizar o status do diagnóstico.'
              );
              console.error('Erro ao atualizar status:', error);
            },
          }),
      nzCancelText: 'Não',
      nzOnCancel: () => {
        this.message.info('Ação de alteração de status cancelada.');
      },
    });
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.atualizarDiagnosticosFiltrados();
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.atualizarDiagnosticosFiltrados();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.atualizarDiagnosticosFiltrados();
  }

  getNomeAnimalPorId(id: number): string {
    let nome = '';
    this.animais$
      .subscribe((animais) => {
        const animal = animais.find((a) => a.id_animal === id);
        nome = animal ? animal.nome_animal : '';
      })
      .unsubscribe();
    return nome;
  }

  abrirModal(
    modo: 'cadastrar' | 'editar' | 'abrir',
    diagnostico?: Diagnostico
  ) {
    if (modo === 'editar') {
      this.modalService.confirm({
        nzTitle: 'Confirmação',
        nzContent: 'Tem certeza que deseja editar este diagnóstico?',
        nzOkText: 'Sim',
        nzCancelText: 'Não',
        nzOnOk: () => this.abrirFormularioModal(modo, diagnostico),
      });
    } else {
      this.abrirFormularioModal(modo, diagnostico);
    }
  }

  private abrirFormularioModal(
    modo: 'cadastrar' | 'editar' | 'abrir',
    diagnostico?: Diagnostico
  ) {
    const modalRef = this.modalService.create({
      nzTitle:
        modo === 'cadastrar'
          ? 'Cadastrar Diagnóstico'
          : modo === 'editar'
          ? 'Editar Diagnóstico'
          : 'Detalhes do Diagnóstico',
      nzContent: DiagnosticoFormComponent,
      nzComponentParams: {
        diagnostico,
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
        this.diagnosticos$ = this.service.list();
        this.atualizarDiagnosticosFiltrados();
      }
    });
  }
}
