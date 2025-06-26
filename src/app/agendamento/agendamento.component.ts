import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Agendamento } from './agendamento';
import { AgendamentoService } from './agendamento.service';
import { AgendamentoFormComponent } from './agendamento-form/agendamento-form.component';
import { PessoaService } from '../pessoa/pessoa.service';
import { AnimalService } from '../animal/animal.service';
import { AgendamentoDetalhesComponent } from './agendamento-detalhes/agendamento-detalhes.component';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.css'],
})
export class AgendamentoComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  agendamentosFiltrados: Agendamento[] = [];
  searchValue: string = '';

  tutores: { label: string; value: string }[] = [];
  animais: { label: string; value: number }[] = [];

  statusFilter: string = '';
  agendamentosDiaSubject: BehaviorSubject<Agendamento[]> = new BehaviorSubject<
    Agendamento[]
  >([]);

  constructor(
    private modal: NzModalService,
    private agendamentoService: AgendamentoService,
    private pessoaService: PessoaService,
    private animalService: AnimalService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadAgendamentos();
  }

  loadAgendamentos(callback?: () => void): void {
    this.agendamentoService.list().subscribe((data) => {
      this.agendamentos = data.map((agendamento) => ({
        ...agendamento,
        data_hora_agendamento: new Date(
          agendamento.data_hora_agendamento[0], // Ano
          agendamento.data_hora_agendamento[1] - 1, // Mês (0-based)
          agendamento.data_hora_agendamento[2], // Dia
          agendamento.data_hora_agendamento[3], // Hora
          agendamento.data_hora_agendamento[4] // Minuto
        ),
      }));

      this.agendamentosFiltrados = [...this.agendamentos];

      if (callback) callback();
    });
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.filtrarAgendamentos();
  }

  filtrarAgendamentos(): void {
    const search = this.searchValue.trim().toLowerCase();
    this.agendamentosFiltrados = this.agendamentos.filter((agendamento) => {
      const matchTexto =
        (agendamento.animal?.pessoa?.nome_pessoa || '')
          .toLowerCase()
          .includes(search) ||
        (agendamento.animal?.nome_animal || '')
          .toLowerCase()
          .includes(search) ||
        (agendamento.procedimento_agendamento || '')
          .toLowerCase()
          .includes(search);

      const matchStatus = this.statusFilter
        ? agendamento.status_agendamento === this.statusFilter
        : true;

      return matchTexto && matchStatus;
    });
  }

  onSearchChange(): void {
    const value = this.searchValue.toLowerCase();
    this.agendamentosFiltrados = this.agendamentos.filter(
      (agendamento) =>
        (agendamento.animal.pessoa.nome_pessoa || '')
          .toLowerCase()
          .includes(value) ||
        (agendamento.animal.nome_animal || '').toLowerCase().includes(value) ||
        (agendamento.procedimento_agendamento || '')
          .toLowerCase()
          .includes(value)
    );
    if (this.statusFilter) {
      this.agendamentosFiltrados = this.agendamentosFiltrados.filter(
        (a) => a.status_agendamento === this.statusFilter
      );
    }
  }

  getAgendamentosByDate(date: Date): Agendamento[] {
    return this.agendamentosFiltrados.filter((agendamento) => {
      const agendamentoDate = new Date(agendamento.data_hora_agendamento);
      return (
        agendamentoDate.getFullYear() === date.getFullYear() &&
        agendamentoDate.getMonth() === date.getMonth() &&
        agendamentoDate.getDate() === date.getDate()
      );
    });
  }

  getEventClass(agendamento: Agendamento): string {
    switch (agendamento.status_agendamento) {
      case 'Confirmado':
        return 'event-confirmed';
      case 'Pendente':
        return 'event-pending';
      case 'Cancelado':
        return 'event-canceled';
      default:
        return '';
    }
  }

  // Ajuste: onDateSelect agora usa o date nos handlers
  onDateSelect(date: Date): void {
    const agendamentosDoDia = this.getAgendamentosByDate(date);
    this.agendamentosDiaSubject = new BehaviorSubject<Agendamento[]>(
      agendamentosDoDia
    );

    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');

    if (agendamentosDoDia.length) {
      const modalRef = this.modal.create({
        nzTitle: `Agendamentos em ${formattedDate}`,
        nzContent: AgendamentoDetalhesComponent,
        nzComponentParams: {
          agendamentos$: this.agendamentosDiaSubject.asObservable(),
        },

        nzFooter: null,
      });

      const instance = modalRef.getContentComponent();
      if (instance) {
        instance.editar.subscribe((agendamento: Agendamento) => {
          this.openModal(agendamento, date);
          modalRef.close();
        });
        instance.confirmar.subscribe((agendamento: Agendamento) => {
          this.confirmarAgendamento(agendamento, date);
          modalRef.close();
        });
        instance.cancelar.subscribe((agendamento: Agendamento) => {
          this.cancelarAgendamento(agendamento, date);
          modalRef.close();
        });
      }
    }
  }

  // Aceita date opcional
  confirmarAgendamento(agendamento: Agendamento, date?: Date): void {
    this.agendamentoService
      .update(agendamento.id_agenda!, { status_agendamento: 'Confirmado' })
      .subscribe({
        next: () => {
          this.loadAgendamentos(() => {
            if (date) this.atualizarAgendamentosDia(date);
          });
        },
        error: (err) => console.error('Erro ao confirmar agendamento:', err),
      });
  }

  cancelarAgendamento(agendamento: Agendamento, date?: Date): void {
    this.agendamentoService
      .update(agendamento.id_agenda!, { status_agendamento: 'Cancelado' })
      .subscribe({
        next: () => {
          this.loadAgendamentos(() => {
            if (date) this.atualizarAgendamentosDia(date);
          });
        },
        error: (err) => console.error('Erro ao cancelar agendamento:', err),
      });
  }

  // Aceita date opcional
  openModal(agendamento?: Agendamento, date?: Date): void {
    if (agendamento) {
      this.pessoaService.list().subscribe((pessoas) => {
        this.tutores = pessoas.map((pessoa) => ({
          label: pessoa.nome_pessoa,
          value: pessoa.id_pessoa.toString(),
        }));

        this.animalService.list().subscribe((animais) => {
          this.animais = animais
            .filter(
              (animal) => animal.pessoa.id_pessoa === animal.pessoa?.id_pessoa
            )
            .map((animal) => ({
              label: animal.nome_animal,
              value: animal.id_animal,
            }));

          const modalRef = this.modal.create({
            nzTitle: 'Editar Agendamento',
            nzContent: AgendamentoFormComponent,
            nzFooter: null,
            nzWidth: '600px',
            nzComponentParams: {
              agendamento: agendamento,
            },
          });

          modalRef.afterClose.subscribe((result) => {
            if (result) {
              this.agendamentoService
                .update(agendamento.id_agenda!, result)
                .subscribe(() => {
                  this.loadAgendamentos(() => {
                    if (date) this.atualizarAgendamentosDia(date);
                  });
                });
            }
          });
        });
      });
    } else {
      const modalRef = this.modal.create({
        nzTitle: 'Novo Agendamento',
        nzContent: AgendamentoFormComponent,
        nzFooter: null,
        nzWidth: '600px',
        nzComponentParams: {
          agendamento: null,
        },
      });

      modalRef.afterClose.subscribe((result) => {
        if (result) {
          this.agendamentoService.add(result).subscribe(() => {
            this.loadAgendamentos();
          });
        }
      });
    }
  }

  // Método para atualizar o subject após alteração
  atualizarAgendamentosDia(date: Date) {
    const agendamentosAtualizados = this.getAgendamentosByDate(date);
    this.agendamentosDiaSubject.next(agendamentosAtualizados);
  }
}
