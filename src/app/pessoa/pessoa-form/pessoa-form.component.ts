import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { PessoaService } from '../pessoa.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Pessoa } from '../pessoa';

@Component({
  selector: 'app-pessoa-form',
  templateUrl: './pessoa-form.component.html',
  styleUrls: ['./pessoa-form.component.css'],
})
export class PessoaFormComponent implements OnInit {
  @Output() pessoaCadastrada = new EventEmitter<any>();
  @Output() cancelado = new EventEmitter<void>();

  @Input() pessoa?: any; // Pessoa recebida para edição ou visualização
  @Input() modo!: 'cadastrar' | 'editar' | 'abrir'; // Modo atual do formulário

  pessoaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private router: Router,
    private message: NzMessageService // Injetar o serviço de mensagens
  ) {}

  ngOnInit(): void {
    this.pessoaForm = this.fb.group({
      nome_pessoa: ['', [Validators.required]],
      cpf_pessoa: ['', [Validators.required, this.validarCPF]],
      data_nascimento_pessoa: [
        null,
        [Validators.required, this.validarDataNascimento],
      ],
      telefone_pessoa: [
        '',
        [Validators.required, Validators.pattern(/^\d{10,11}$/)],
      ],
      phoneNumberPrefix: ['+55'],
      complemento_pessoa: [''],
      cep_pessoa: ['', [Validators.required]],
      cidade_pessoa: [{ value: '', disabled: true }],
      estado_pessoa: [{ value: '', disabled: true }],
      uf_pessoa: [{ value: '', disabled: true }],
      rua_pessoa: [{ value: '', disabled: true }],
      bairro_pessoa: [{ value: '', disabled: true }],
      numero_pessoa: ['', Validators.required],
      genero_pessoa: [''],
    });
  }

  submitForm(): void {
    if (this.pessoaForm.valid) {
      const pessoaData = {
        ...this.pessoaForm.getRawValue(),
        status_pessoa: 'Ativo',
      };

      this.pessoaService.cadastrarPessoa(pessoaData).subscribe({
        next: (response) => {
          console.log('Pessoa cadastrada com sucesso:', response);
          this.message.success('Pessoa cadastrada com sucesso!'); // Mensagem de sucesso
          this.pessoaCadastrada.emit(response);
          this.router.navigate(['pessoas']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar pessoa:', error);
          this.message.error('Erro ao cadastrar pessoa. Tente novamente.'); // Mensagem de erro
        },
      });
    } else {
      this.validarFormulario();
      this.message.error('Por favor, preencha todos os campos obrigatórios.'); // Mensagem de erro para formulário inválido
    }
  }

  buscarCEP(): void {
    const cep = this.pessoaForm.get('cep_pessoa')?.value;
    if (cep) {
      this.pessoaService.buscarCEP(cep).subscribe((data: any) => {
        if (data && !data.erro) {
          this.pessoaForm.patchValue({
            cidade_pessoa: data.localidade,
            estado_pessoa: data.estado,
            rua_pessoa: data.logradouro,
            bairro_pessoa: data.bairro,
            uf_pessoa: data.uf,
          });
        } else {
          this.message.warning(
            'CEP não encontrado. Verifique o valor e tente novamente.'
          ); // Mensagem de aviso
        }
      });
    }
  }

  validarCPF(control: AbstractControl) {
    const cpf = control.value;
    if (!cpf) return null;
    const cpfValido = cpf.length === 11 && !/^(\d)\1+$/.test(cpf);
    return cpfValido ? null : { cpfInvalido: true };
  }

  validarDataNascimento(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const dataNascimento = control.value;
    if (dataNascimento && new Date(dataNascimento) > new Date()) {
      return { dataInvalida: true };
    }
    return null;
  }

  cancelar(): void {
    this.cancelado.emit();
  }

  private validarFormulario(): void {
    Object.values(this.pessoaForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}
