import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-pessoa-form',
  templateUrl: './pessoa-form.component.html',
  styleUrls: ['./pessoa-form.component.css'],
})
export class PessoaFormComponent implements OnInit, OnChanges {
  @Output() pessoaCadastrada = new EventEmitter<any>();
  @Output() cancelado = new EventEmitter<void>();

  @Input() pessoa?: Pessoa;
  @Input() modo!: 'cadastrar' | 'editar' | 'abrir';

  pessoaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private router: Router,
    private message: NzMessageService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {
    this.criarFormulario();

    if (this.pessoa) {
      this.preencherFormulario(this.pessoa);
    }
    if (this.modo === 'abrir') {
      this.pessoaForm.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pessoa'] && changes['pessoa'].currentValue) {
      this.preencherFormulario(changes['pessoa'].currentValue);
    }
    if (changes['modo'] && changes['modo'].currentValue === 'abrir') {
      this.pessoaForm?.disable();
    }
    if (changes['modo'] && changes['modo'].currentValue !== 'abrir') {
      this.pessoaForm?.enable();
    }
  }

  criarFormulario() {
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
      cidade_pessoa: [''],
      estado_pessoa: [''],
      uf_pessoa: [''],
      rua_pessoa: [''],
      bairro_pessoa: [''],
      numero_pessoa: ['', Validators.required],
      genero_pessoa: [''],
    });
  }

  preencherFormulario(pessoa: Pessoa) {
    if (this.pessoaForm) {
      this.pessoaForm.patchValue({
        nome_pessoa: pessoa.nome_pessoa || '',
        cpf_pessoa: pessoa.cpf_pessoa || '',
        data_nascimento_pessoa: pessoa.data_nascimento_pessoa || '',
        telefone_pessoa: pessoa.telefone_pessoa || '',
        phoneNumberPrefix: '+55',
        cep_pessoa: pessoa.cep_pessoa || '',
        cidade_pessoa: pessoa.cidade_pessoa || '',
        estado_pessoa: pessoa.estado_pessoa || '',
        uf_pessoa: pessoa.uf_pessoa || '',
        rua_pessoa: pessoa.rua_pessoa || '',
        bairro_pessoa: pessoa.bairro_pessoa || '',
        numero_pessoa: pessoa.numero_pessoa || '',
        genero_pessoa: pessoa.genero_pessoa || '',
      });
    }
  }

  submitForm(): void {
    if (this.pessoaForm.valid) {
      const pessoaData = {
        ...this.pessoaForm.getRawValue(),
        status_pessoa: 'Ativo',
      };

      // Aqui diferenciamos Cadastro e Edição!
      if (this.modo === 'editar' && this.pessoa && this.pessoa.id_pessoa) {
        this.pessoaService.update(this.pessoa.id_pessoa, pessoaData).subscribe({
          next: (response) => {
            this.message.success('Pessoa atualizada com sucesso!');
            this.modalRef.close(response);
          },
          error: () => {
            this.message.error('Erro ao atualizar pessoa. Tente novamente.');
          },
        });
      } else if (this.modo === 'cadastrar') {
        this.pessoaService.cadastrarPessoa(pessoaData).subscribe({
          next: (response) => {
            this.message.success('Pessoa cadastrada com sucesso!');
            this.modalRef.close(response);
          },
          error: () => {
            this.message.error('Erro ao cadastrar pessoa. Tente novamente.');
          },
        });
      }
    } else {
      this.validarFormulario();
      this.message.error('Por favor, preencha todos os campos obrigatórios.');
    }
  }
  cancelar(): void {
    this.modalRef.close(); // cancela e fecha o modal
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
          );
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

  private validarFormulario(): void {
    Object.values(this.pessoaForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}
