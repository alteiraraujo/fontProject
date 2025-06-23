import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColaboradorService } from '../colaborador.service';
import { PessoaService } from 'src/app/pessoa/pessoa.service';
import { Colaborador } from '../colaborador';
import { Pessoa } from 'src/app/pessoa/pessoa';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-colaborador-form',
  templateUrl: './colaborador-form.component.html',
  styleUrls: ['./colaborador-form.component.css'],
})
export class ColaboradorFormComponent implements OnInit, OnChanges {
  @Input() colaborador?: Colaborador;
  @Input() modo!: 'cadastrar' | 'editar' | 'abrir';
  @Output() colaboradorSalvo = new EventEmitter<Colaborador>();
  @Output() cancelado = new EventEmitter<void>();

  colaboradorForm: FormGroup;
  pessoas$: Observable<Pessoa[]>;


  constructor(
    private fb: FormBuilder,
    private colaboradorService: ColaboradorService,
    private pessoaService: PessoaService,
    private message: NzMessageService,
    private modalRef: NzModalRef,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.pessoas$ = this.pessoaService.list(); // ajuste se necessário
    this.criarFormulario();

    if (this.colaborador) {
      this.preencherFormulario(this.colaborador);
    }
    if (this.modo === 'abrir') {
      this.colaboradorForm.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['colaborador'] && changes['colaborador'].currentValue) {
      this.preencherFormulario(changes['colaborador'].currentValue);
    }
    if (changes['modo'] && changes['modo'].currentValue === 'abrir') {
      this.colaboradorForm?.disable();
    }
    if (changes['modo'] && changes['modo'].currentValue !== 'abrir') {
      this.colaboradorForm?.enable();
    }
  }

  criarFormulario() {
    this.colaboradorForm = this.fb.group({
      selectedPessoaId: [null, Validators.required],
      cargo_colaborador: [null, Validators.required],
      login_colaborador: [null, Validators.required],
      senha_colaborador: [null, Validators.required],
      email_colaborador: [null, [Validators.required, Validators.email]],
    });
  }

  preencherFormulario(colaborador: Colaborador) {
    if (this.colaboradorForm) {
      this.colaboradorForm.patchValue({
        selectedPessoaId: colaborador.pessoa?.id_pessoa || null,
        cargo_colaborador: colaborador.cargo_colaborador || null,
        login_colaborador: colaborador.login_colaborador || null,
        senha_colaborador: colaborador.senha_colaborador || null,
        email_colaborador: colaborador.email_colaborador || null,
      });
    }
  }

  onPessoaChange(pessoaId: number) {
    // Se quiser ações ao selecionar uma pessoa, implemente aqui.
  }

  openPessoaModal(): void {
    // Implemente caso deseje abrir modal de cadastro de pessoa
    // Exemplo: this.modalService.create({ ... });
  }

  onSubmit(): void {
    if (this.colaboradorForm.valid) {
      const formValue = this.colaboradorForm.getRawValue();
      const colaboradorData: Colaborador = {
        ...this.colaborador,
        pessoa: { id_pessoa: formValue.selectedPessoaId },
        cargo_colaborador: formValue.cargo_colaborador,
        login_colaborador: formValue.login_colaborador,
        senha_colaborador: formValue.senha_colaborador,
        email_colaborador: formValue.email_colaborador,
        status_colaborador: 'Ativo'
      };

      if (this.modo === 'editar' && this.colaborador && this.colaborador.id_colaborador) {
        this.colaboradorService.update(this.colaborador.id_colaborador, colaboradorData).subscribe({
          next: (response) => {
            this.message.success('Colaborador atualizado com sucesso!');
            this.modalRef.close(response); // Fecha modal e atualiza pai
          },
          error: () => {
            this.message.error('Erro ao atualizar colaborador. Tente novamente.');
          }
        });
      } else if (this.modo === 'cadastrar') {
        this.colaboradorService.add(colaboradorData).subscribe({
          next: (response) => {
            this.message.success('Colaborador cadastrado com sucesso!');
            this.modalRef.close(response); // Fecha modal e atualiza pai
          },
          error: () => {
            this.message.error('Erro ao cadastrar colaborador. Tente novamente.');
          }
        });
      }
    } else {
      this.message.error('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  cancelar(): void {
    this.modalRef.close();
  }
}
