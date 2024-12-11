import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Categoria } from '../categoria';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModoFormulario } from 'src/app/enuns/modo-formulario.enum';
import { MensagensErro } from 'src/app/enuns/mensagens-erro.enum';
import { MensagensInfo } from 'src/app/enuns/mensagens-info.enum';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css'],
})
export class CategoriaFormComponent implements OnInit {
  @Input() categoria?: Categoria;
  @Input() modo: 'cadastrar' | 'editar' | 'abrir'; 

  @Output() formSubmit: EventEmitter<Categoria> = new EventEmitter<Categoria>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id_categoria: [this.categoria?.id_categoria || null],
      nome_categoria: [
        this.categoria?.nome_categoria || '',
        [Validators.required, Validators.minLength(3)],
      ],
      status_categoria: [
        this.categoria?.status_categoria || 'Ativo',
        Validators.required,
      ],
    });

    if (this.modo === ModoFormulario.ABRIR) {
      this.form.disable();
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      this.modalRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
      this.message.error(MensagensErro.FORM_INVALIDO);
    }
  }

  cancel(): void {
    if (this.modo === ModoFormulario.CADASTRAR) {
      this.message.info(MensagensInfo.CADASTRO_CANCELADO);
    } else if (this.modo === ModoFormulario.EDITAR) {
      this.message.info(MensagensInfo.EDICAO_CANCELADA);
    }
    this.modalRef.close();
  }
  closeModal(resultado?: any): void {
    this.modalRef.destroy(resultado);
  }
}
