import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Agendamento } from './agendamento';
import { AgendamentoService } from './agendamento.service';
import { AgendamentoFormComponent } from './agendamento-form/agendamento-form.component';
import { PessoaService } from '../pessoa/pessoa.service';
import { AnimalService } from '../animal/animal.service';
import { AgendamentoDetalhesComponent } from './agendamento-detalhes/agendamento-detalhes.component';
import { DatePipe } from '@angular/common';

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

  loadAgendamentos(): void {
    this.agendamentoService.list().subscribe((data) => {
      console.log('Agendamentos carregados:', data);

      // Transformar `data_hora_agendamento` para Date
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
    });
  }

  onSearchChange(): void {
    this.agendamentosFiltrados = this.agendamentos.filter((agendamento) =>
      (agendamento.animal.pessoa.nome_pessoa || '')
        .toLowerCase()
        .includes(this.searchValue.toLowerCase())
    );
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

  // Adicione o método onDateSelect
  onDateSelect(date: Date): void {
    const agendamentosDoDia = this.getAgendamentosByDate(date);
    console.log(`Agendamentos para ${date.toDateString()}:`, agendamentosDoDia);
  
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy'); // Formata a data
  
    if (agendamentosDoDia.length) {
      const modalRef = this.modal.create({
        nzTitle: `Agendamentos em ${formattedDate}`,
        nzContent: AgendamentoDetalhesComponent,
        nzComponentParams: {
          agendamentos: agendamentosDoDia,
        },
        nzFooter: null,
      });
  
      // Tratar os eventos emitidos pelo componente filho
      const instance = modalRef.getContentComponent();
      if (instance) {
        instance.editar.subscribe((agendamento: Agendamento) => {
          this.openModal(agendamento); // Abre o modal para edição
        });
        instance.confirmar.subscribe((agendamento: Agendamento) => {
          this.confirmarAgendamento(agendamento);
          modalRef.close(); // Opcional: fecha o modal após a ação
        });
        instance.cancelar.subscribe((agendamento: Agendamento) => {
          this.cancelarAgendamento(agendamento);
          modalRef.close(); // Opcional: fecha o modal após a ação
        });
      }
    }
  }

  confirmarAgendamento(agendamento: Agendamento): void {
    this.agendamentoService
      .update(agendamento.id_agenda!, { status_agendamento: 'Confirmado' }) // Envia apenas o campo status
      .subscribe({
        next: () => {
          this.loadAgendamentos(); // Recarrega os agendamentos para refletir a alteração
          console.log(`Agendamento ${agendamento.id_agenda} confirmado.`);
        },
        error: (err) => console.error('Erro ao confirmar agendamento:', err),
      });
  }
  
  cancelarAgendamento(agendamento: Agendamento): void {
    this.agendamentoService
      .update(agendamento.id_agenda!, { status_agendamento: 'Cancelado' }) // Envia apenas o campo status
      .subscribe({
        next: () => {
          this.loadAgendamentos(); // Recarrega os agendamentos para refletir a alteração
          console.log(`Agendamento ${agendamento.id_agenda} cancelado.`);
        },
        error: (err) => console.error('Erro ao cancelar agendamento:', err),
      });
  }
  
  

  openModal(agendamento?: Agendamento): void {
    if (agendamento) {
      // Carregar tutores e animais antes de abrir o modal
      this.pessoaService.list().subscribe((pessoas) => {
        this.tutores = pessoas.map((pessoa) => ({
          label: pessoa.nome_pessoa,
          value: pessoa.id_pessoa.toString(),
        }));
  
        this.animalService.list().subscribe((animais) => {
          this.animais = animais
            .filter((animal) => animal.pessoa.id_pessoa === animal.pessoa?.id_pessoa)
            .map((animal) => ({
              label: animal.nome_animal,
              value: animal.id_animal,
            }));
  
          // Abrir o modal após carregar os dados necessários
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
              this.agendamentoService.update(agendamento.id_agenda!, result).subscribe(() => {
                this.loadAgendamentos();
              });
            }
          });
        });
      });
    } else {
      // Abrir o modal para novo agendamento
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
  
  
  
}
