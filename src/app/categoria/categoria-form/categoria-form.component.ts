import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Categoria } from '../categoria';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit {
  @Output() formSubmit: EventEmitter<Categoria> = new EventEmitter<Categoria>();
  form: FormGroup;

  constructor(private fb: FormBuilder, private modalRef: NzModalRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome_categoria: ['', [Validators.required, Validators.minLength(3)]],
      status_categoria: ['Ativo']
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      this.modalRef.close(this.form.value); // Fecha o modal e retorna os valores do formulário
    } else {
      // Marca todos os campos como "touched" para exibir mensagens de erro
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.modalRef.close(); // Fecha o modal sem enviar dados
  }
}
