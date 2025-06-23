import { Component, OnInit } from '@angular/core';
import { ServicoService } from './servico.service';
import { Servico } from './servico';
import { Observable, catchError, finalize, map, of } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ServicoFormComponent } from './servico-form/servico-form.component';
import { AnimalService } from '../animal/animal.service';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.css'],
})
export class ServicoComponent implements OnInit {
  servicos$: Observable<Servico[]>;
  servicosFiltrados$: Observable<Servico[]>;
  pageIndex = 1;
  pageSize = 8;
  searchValue = '';
  statusFilter = '';
  animais: any[] = [];
  carregando = false;

  constructor(
    private service: ServicoService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private animalService: AnimalService
  ) {}

  ngOnInit() {
    this.carregando = true;
    this.servicos$ = this.service.list().pipe(
      finalize(() => (this.carregando = false)),
      catchError((error) => {
        this.carregando = false;
        this.message.error('Falha ao carregar serviços.');
        return of([]);
      })
    );
    this.atualizarServicosFiltrados();

    // Se quiser mostrar spin para o carregamento dos animais também, você pode criar um carregandoAnimais, ou usar o mesmo "carregando" só enquanto ambos não terminam.
    this.animalService.list().subscribe({
      next: (animais) => {
        this.animais = animais;
      },
      error: () => {
        this.message.error('Falha ao carregar animais.');
      },
    });
  }
  getNomeAnimalPorId(id: number): string {
    const animal = this.animais.find((a) => a.id_animal === id);
    return animal ? animal.nome_animal : '';
  }

  atualizarServicosFiltrados() {
    this.servicosFiltrados$ = this.servicos$.pipe(
      map((servicos) =>
        servicos
          .filter(
            (servico) =>
              (this.statusFilter === '' ||
                servico.status_servico === this.statusFilter) &&
              (servico.id_servico?.toString().includes(this.searchValue) ||
                servico.obs_servico
                  ?.toLowerCase()
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
    this.atualizarServicosFiltrados();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.atualizarServicosFiltrados();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.atualizarServicosFiltrados();
  }

  abrirModal(modo: 'cadastrar' | 'editar' | 'abrir', servico?: Servico) {
    if (modo === 'editar') {
      this.modalService.confirm({
        nzTitle: 'Confirmação',
        nzContent: 'Tem certeza que deseja editar este serviço?',
        nzOkText: 'Sim',
        nzCancelText: 'Não',
        nzOnOk: () => this.abrirFormularioModal(modo, servico),
      });
    } else {
      this.abrirFormularioModal(modo, servico);
    }
  }

  private abrirFormularioModal(
    modo: 'cadastrar' | 'editar' | 'abrir',
    servico?: Servico
  ) {
    const modalRef = this.modalService.create({
      nzTitle:
        modo === 'cadastrar'
          ? 'Cadastrar Serviço'
          : modo === 'editar'
          ? 'Editar Serviço'
          : 'Detalhes do Serviço',
      nzContent: ServicoFormComponent,
      nzComponentParams: {
        servico,
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
        this.servicos$ = this.service.list();
        this.atualizarServicosFiltrados();
      }
    });
  }
}
