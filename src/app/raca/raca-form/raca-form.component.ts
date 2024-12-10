import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Raca } from '../raca';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { RacaService } from '../raca.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-raca-form',
  templateUrl: './raca-form.component.html',
  styleUrls: ['./raca-form.component.css'],
})
export class RacaFormComponent implements OnInit {
  @Output() racaCadastrada: EventEmitter<Raca> = new EventEmitter<Raca>(); // Evento para raca cadastrada
  @Output() cancelado: EventEmitter<void> = new EventEmitter<void>(); // Evento para cancelamento
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private racaService: RacaService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome_raca: ['', [Validators.required, Validators.minLength(3)]],
      especie_raca: ['', Validators.required],
      status_raca: ['Ativo'],
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      const novaRaca: Raca = this.form.value;
      this.racaService.create(novaRaca).subscribe({
        next: (res) => {
          this.message.success('Raça cadastrada com sucesso!');
          this.racaCadastrada.emit(res); // Emite o evento com a raça criada
          this.modalRef.close();
        },
        error: () => {
          this.message.error('Erro ao cadastrar a raça. Tente novamente.');
        },
      });
    } else {
      this.message.error('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  cancel(): void {
    this.cancelado.emit(); // Emite o evento cancelado
    this.modalRef.close(); // Fecha o modal
  }
}
