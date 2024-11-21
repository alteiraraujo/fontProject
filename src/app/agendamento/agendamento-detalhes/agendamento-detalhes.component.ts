import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Agendamento } from '../agendamento';

@Component({
  selector: 'app-agendamento-detalhes',
  templateUrl: './agendamento-detalhes.component.html',
  styleUrls: ['./agendamento-detalhes.component.css'],
})
export class AgendamentoDetalhesComponent {
  @Input() agendamentos: Agendamento[] = [];
  @Output() editar = new EventEmitter<Agendamento>();
  @Output() confirmar = new EventEmitter<Agendamento>();
  @Output() cancelar = new EventEmitter<Agendamento>();

  onEditar(agendamento: Agendamento): void {
    this.editar.emit(agendamento);
  }

  onConfirmar(agendamento: Agendamento): void {
    this.confirmar.emit(agendamento);
  }

  onCancelar(agendamento: Agendamento): void {
    this.cancelar.emit(agendamento);
  }
  
}

