import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Agendamento } from './agendamento';
import { AgendamentoService } from './agendamento.service';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.css'],
})
export class AgendamentoComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  agendamentosFiltrados: Agendamento[] = [];
  isModalVisible: boolean = false;
  isEditing: boolean = false;
  agendamentoForm: FormGroup;
  currentAgendamento: Agendamento | null = null;
  searchValue: string = '';

  constructor(
    private fb: FormBuilder,
    private agendamentoService: AgendamentoService
  ) {}

  
  ngOnInit(): void {
    this.agendamentoForm = this.fb.group({
      data_hora_agendamento: [null, Validators.required],
      procedimento_agendamento: [null, Validators.required],
      tutor_animal: ['', Validators.required],
      status_agendamento: ['Pendente', Validators.required],
    });
  

    this.agendamentoService.list().subscribe((data) => {
      this.agendamentos = data;
      this.agendamentosFiltrados = data;
    });
  }

  onSearchChange(): void {
    this.agendamentosFiltrados = this.agendamentos.filter((agendamento) =>
      agendamento.tutor_animal
        .toLowerCase()
        .includes(this.searchValue.toLowerCase())
    );
  }

  getAgendamentosByDate(date: Date): Agendamento[] {
    return this.agendamentosFiltrados.filter(
      (agendamento) =>
        new Date(agendamento.data_hora_agendamento).toDateString() ===
        date.toDateString()
    );
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

  onDateSelect(date: Date): void {
    console.log('Data selecionada:', date);
    // Se necessário, você pode adicionar lógica para manipular eventos específicos nesta data
  }

  openModal(agendamento?: Agendamento): void {
    console.log('Abrindo modal', agendamento);
    this.isModalVisible = true;
    this.isEditing = !!agendamento;
  
    if (agendamento) {
      this.agendamentoForm.patchValue(agendamento);
    } else {
      this.agendamentoForm.reset({ status_agendamento: 'Pendente' });
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.isEditing = false;
    this.currentAgendamento = null;
  }

  onSubmit(): void {
    if (this.agendamentoForm.valid) {
      const formData: Agendamento = this.agendamentoForm.value;

      if (this.isEditing && this.currentAgendamento) {
        // Atualizar agendamento existente
        this.agendamentoService
          .update(this.currentAgendamento.id_agenda!, formData)
          .subscribe(() => {
            this.loadAgendamentos();
            this.closeModal();
          });
      } else {
        // Criar novo agendamento
        this.agendamentoService.add(formData).subscribe(() => {
          this.loadAgendamentos();
          this.closeModal();
        });
      }
    }
  }

  private loadAgendamentos(): void {
    this.agendamentoService.list().subscribe((data) => {
      this.agendamentos = data;
      this.agendamentosFiltrados = data;
    });
  }
}
