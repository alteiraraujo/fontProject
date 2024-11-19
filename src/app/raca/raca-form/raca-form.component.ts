import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Raca } from '../raca';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-raca-form',
  templateUrl: './raca-form.component.html',
  styleUrls: ['./raca-form.component.css'],
})
export class RacaFormComponent implements OnInit {
  @Output() formSubmit: EventEmitter<Raca> = new EventEmitter<Raca>();
  form: FormGroup;

  constructor(private fb: FormBuilder, private modalRef: NzModalRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome_raca: ['', [Validators.required, Validators.minLength(3)]],
      especie_raca: ['', Validators.required],
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      this.modalRef.close(this.form.value); // Emite os dados do formulário e fecha o modal
    }
  }
}
