import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Diagnostico } from '../diagnostico';
import { DiagnosticoService } from '../diagnostico.service';
import { AnimalService } from '../../animal/animal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-diagnostico-form',
  templateUrl: './diagnostico-form.component.html',
  styleUrls: ['./diagnostico-form.component.css']
})
export class DiagnosticoFormComponent implements OnInit, OnChanges {
  @Input() diagnostico?: Diagnostico;
  @Input() modo!: 'cadastrar' | 'editar' | 'abrir';

  form: FormGroup;
  animais$: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private diagnosticoService: DiagnosticoService,
    private animalService: AnimalService,
    private message: NzMessageService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {
    this.animais$ = this.animalService.list();
    this.criarFormulario();

    if (this.diagnostico) {
      this.preencherFormulario(this.diagnostico);
    } else {
      // Seta data atual ao cadastrar
      this.form.get('data_diagnostico')?.setValue(new Date());
    }

    if (this.modo === 'abrir') {
      this.form.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['diagnostico'] && changes['diagnostico'].currentValue) {
      this.preencherFormulario(changes['diagnostico'].currentValue);
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
      data_diagnostico: [null, Validators.required],
      descricao_diagnostico: ['', [Validators.required, Validators.maxLength(255)]],
      id_animal: [null, Validators.required]
    });
  }

  preencherFormulario(diagnostico: Diagnostico) {
    if (this.form) {
      this.form.patchValue({
        data_diagnostico: diagnostico.data_diagnostico ? new Date(diagnostico.data_diagnostico) : null,
        descricao_diagnostico: diagnostico.descricao_diagnostico || '',
        id_animal: diagnostico.animal?.id_animal || null
      });
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      const data: any = {
        data_diagnostico: this.form.get('data_diagnostico')?.value,
        descricao_diagnostico: this.form.get('descricao_diagnostico')?.value,
        animal: { id_animal: this.form.get('id_animal')?.value }
      };

      if (this.modo === 'editar' && this.diagnostico?.id_diagnostico) {
        this.diagnosticoService.update(this.diagnostico.id_diagnostico, data).subscribe({
          next: (response) => {
            this.message.success('Diagnóstico atualizado com sucesso!');
            this.modalRef.close(response);
          },
          error: () => {
            this.message.error('Erro ao atualizar diagnóstico.');
          }
        });
      } else if (this.modo === 'cadastrar') {
        this.diagnosticoService.create(data).subscribe({
          next: (response) => {
            this.message.success('Diagnóstico cadastrado com sucesso!');
            this.modalRef.close(response);
          },
          error: () => {
            this.message.error('Erro ao cadastrar diagnóstico.');
          }
        });
      }
    } else {
      this.message.error('Preencha todos os campos obrigatórios.');
    }
  }

  cancelar(): void {
    this.modalRef.close();
  }
}
