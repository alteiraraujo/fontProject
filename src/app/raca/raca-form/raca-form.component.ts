import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Raca } from '../raca';
import { RacaService } from '../raca.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-raca-form',
  templateUrl: './raca-form.component.html',
  styleUrls: ['./raca-form.component.css']
})
export class RacaFormComponent implements OnInit, OnChanges {
  @Input() raca?: Raca;
  @Input() modo!: 'cadastrar' | 'editar' | 'abrir';

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private racaService: RacaService,
    private message: NzMessageService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {
    this.criarFormulario();

    if (this.raca) {
      this.preencherFormulario(this.raca);
    }
    if (this.modo === 'abrir') {
      this.form.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['raca'] && changes['raca'].currentValue) {
      this.preencherFormulario(changes['raca'].currentValue);
    }
    if (changes['modo'] && changes['modo'].currentValue === 'abrir') {
      this.form?.disable();
    }
    if (changes['modo'] && changes['modo'].currentValue !== 'abrir') {
      this.form?.enable();
    }
  }

  criarFormulario() {
    this.form = this.fb.group({
      nome_raca: ['', [Validators.required, Validators.minLength(3)]],
      especie_raca: ['', Validators.required],
    });
  }

  preencherFormulario(raca: Raca) {
    if (this.form) {
      this.form.patchValue({
        nome_raca: raca.nome_raca || '',
        especie_raca: raca.especie_raca || ''
      });
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      const data: Raca = {
        ...this.raca,
        nome_raca: this.form.value.nome_raca,
        especie_raca: this.form.value.especie_raca,
        status_raca: 'Ativo'
      };

      if (this.modo === 'editar' && this.raca?.id_raca) {
        this.racaService.update(this.raca.id_raca, data).subscribe({
          next: (response) => {
            this.message.success('Raça atualizada com sucesso!');
            this.modalRef.close(response);
          },
          error: () => {
            this.message.error('Erro ao atualizar raça.');
          }
        });
      } else if (this.modo === 'cadastrar') {
        this.racaService.create(data).subscribe({
          next: (response) => {
            this.message.success('Raça cadastrada com sucesso!');
            this.modalRef.close(response);
          },
          error: () => {
            this.message.error('Erro ao cadastrar raça.');
          }
        });
      }
    } else {
      this.message.error('Preencha todos os campos obrigatórios.');
    }
  }

  cancel(): void {
    this.modalRef.close();
  }
}
